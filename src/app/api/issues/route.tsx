import { NextResponse, NextRequest } from "next/server";
import { getLatestToken, getRequestUrl } from "@/services/tokenService";
import { getSupabaseClient } from "@/lib/supabaseClient";

export async function POST(req: NextRequest) {
  try {
    console.log("just hit api/issues POST route");

    // Retrieve the base URL for Jira.
    const baseJiraUrl = await getRequestUrl();

    // Retrieve the latest access token for authorization.
    const token = await getLatestToken();
    if (!token || !token.access_token) {
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
    // Additional validation can be added here if needed.

    // Parse the incoming request body.
    const requestBody = await req.json();
    // Destructure required fields.
    const { projectKey, summary, description, issueType } = requestBody;

    // Validate that the required fields are provided.
    if (!projectKey || !summary || !issueType) {
      return NextResponse.json(
        {
          error:
            "Missing required fields. 'projectKey', 'summary', and 'issueType' are required.",
        },
        { status: 400 }
      );
    }

    // Construct the payload based on Jira's requirements.
    const payload = {
      fields: {
        project: { key: projectKey },
        summary,
        // Description is optional; if not provided, send an empty string.
        description: description || "",
        issuetype: { name: issueType },
      },
    };

    // Construct the Jira create issue URL.
    const createIssueUrl = `${baseJiraUrl}/3/issue`;

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
      return NextResponse.json(
        { error: "Failed to create issue", details: errorText },
        { status: createResponse.status }
      );
    }

    // Parse and return the response from Jira.
    const createData = await createResponse.json();
    return NextResponse.json(createData);
  } catch (error) {
    return NextResponse.json(
      {
        error: "Error creating issue",
        details: error.message || error,
      },
      { status: 500 }
    );
  }
}
