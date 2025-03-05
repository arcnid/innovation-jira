// app/api/issues/[key]/route.js
import { NextResponse } from "next/server";
import { getLatestToken, getRequestUrl } from "@/services/tokenService";
import { getSupabaseClient } from "@/lib/supabaseClient";

export async function GET(req, { params }) {
  try {
    const { issueId } = await params; // We expect the route param to be named "issueId"
    const key = issueId;

    console.log("just hit api/ideas/[issueId]/route.ts with key:", key);

    const baseJiraUrl = await getRequestUrl();
    const token = await getLatestToken();
    if (!token || !token.access_token) {
      return NextResponse.json(
        { error: "Access token not found" },
        { status: 401 }
      );
    }

    const supabase = getSupabaseClient();
    const { data: tokenData, error: tokenError } = await supabase
      .from("tokens")
      .select("*")
      .single();

    // First, fetch the main issue (epic)
    const issueUrl = `${baseJiraUrl}/3/issue/${key}?fields=*all`;
    const issueResponse = await fetch(issueUrl, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token.access_token}`,
        Accept: "application/json",
      },
    });

    if (!issueResponse.ok) {
      const errorText = await issueResponse.text();
      return NextResponse.json(
        { error: "Failed to fetch issue", details: errorText },
        { status: issueResponse.status }
      );
    }

    const issueData = await issueResponse.json();
    console.log("Fetched Jira issue:", issueData);

    // Next, search for child issues.
    // Construct a JQL query to find issues whose parent equals our epic's key.
    const jql = `parent = "${key}"`;
    const searchUrl = `${baseJiraUrl}/3/search?jql=${encodeURIComponent(
      jql
    )}&fields=*all`;

    const searchResponse = await fetch(searchUrl, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token.access_token}`,
        Accept: "application/json",
      },
    });

    let children = [];
    if (searchResponse.ok) {
      const searchData = await searchResponse.json();
      // Assuming issues are in searchData.issues array.
      children = searchData.issues || [];
    } else {
      const errorText = await searchResponse.text();
      console.error("Failed to search for child issues:", errorText);
    }

    // Append children to the main issue data.
    const updatedIssueData = {
      ...issueData,
      children,
    };

    return NextResponse.json(updatedIssueData);
  } catch (error) {
    return NextResponse.json(
      { error: "Error fetching issue", details: error.message || error },
      { status: 500 }
    );
  }
}
