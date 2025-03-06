import { NextResponse, NextRequest } from "next/server";
import { getLatestToken, getRequestUrl } from "@/services/tokenService";
import { getSupabaseClient } from "@/lib/supabaseClient";

export async function POST(req: NextRequest) {
  try {
    console.log("API route hit: /api/issues POST");

    // Retrieve the base URL for Jira.
    const baseJiraUrl = await getRequestUrl();
    console.log("Base Jira URL:", baseJiraUrl);

    // Retrieve the latest access token for authorization.
    const token = await getLatestToken();
    if (!token || !token.access_token) {
      console.error("No valid access token found");
      return NextResponse.json(
        { error: "Access token not found" },
        { status: 401 }
      );
    }

    // (Optional) Validate token using Supabase or other logic.
    const supabase = getSupabaseClient();
    const { data: tokenData, error: tokenError } = await supabase
      .from("tokens")
      .select("*")
      .single();
    if (tokenError) {
      console.error("Error fetching token from Supabase:", tokenError);
    } else {
      console.log("Token data from Supabase:", tokenData);
    }

    // Parse the incoming request body.
    const requestBody = await req.json();
    console.log("Incoming request body:", requestBody);

    // Destructure minimal required fields.
    const { projectKey, summary, description, issueType } = requestBody;

    if (!projectKey || !summary || !issueType) {
      console.error("Missing required fields", {
        projectKey,
        summary,
        issueType,
      });
      return NextResponse.json(
        {
          error:
            "Missing required fields. 'projectKey', 'summary', and 'issueType' are required.",
        },
        { status: 400 }
      );
    }

    // Create an Atlassian Document Format (ADF) object for the description.
    const descriptionContent = description || "No description provided";
    const descriptionADF = {
      type: "doc",
      version: 1,
      content: [
        {
          type: "paragraph",
          content: [
            {
              type: "text",
              text: descriptionContent,
            },
          ],
        },
      ],
    };

    // Construct the payload based on Jira's requirements.
    const payload = {
      fields: {
        project: { key: projectKey },
        summary,
        description: descriptionADF,
        issuetype: { name: "Epic" },
      },
    };

    console.log("Payload to send to Jira:", payload);

    // Construct the Jira create issue URL.
    const createIssueUrl = `${baseJiraUrl}/3/issue`;
    console.log("Creating issue at:", createIssueUrl);

    // Send the POST request to Jira.
    const createResponse = await fetch(createIssueUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token.access_token}`,
      },
      body: JSON.stringify(payload),
    });

    if (!createResponse.ok) {
      const errorText = await createResponse.text();
      console.error("Error creating Jira issue:", errorText);
      return NextResponse.json(
        { error: "Failed to create issue", details: errorText },
        { status: createResponse.status }
      );
    }

    const createData = await createResponse.json();
    console.log("Jira issue created successfully:", createData);

    return NextResponse.json(createData);
  } catch (error: any) {
    console.error("Exception caught while creating issue:", error);
    return NextResponse.json(
      {
        error: "Error creating issue",
        details: error.message || error,
      },
      { status: 500 }
    );
  }
}
