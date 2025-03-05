// pages/api/issues.js
import { NextResponse, NextRequest } from "next/server";
import { getLatestToken, getRequestUrl } from "@/services/tokenService";
import { getSupabaseClient } from "@/lib/supabaseClient";

export async function GET(req: NextRequest) {
  try {
    console.log("just hit api/ideas/route.ts");
    // Retrieve the base URL for Jira and set a default project key.
    const baseJiraUrl = await getRequestUrl();
    const projectKey = "TP"; // Replace with your actual project key or id.
    const maxResults = 100; // max page size
    let startAt = 0;
    let allIssues = [];
    let total = 0;

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
    // Further validation can be added here if needed.

    // Loop through pages until all issues are fetched.
    do {
      const issuesUrl = `${baseJiraUrl}/3/search?jql=project=${projectKey}&fields=*all&startAt=${startAt}&maxResults=${maxResults}`;
      const issuesResponse = await fetch(issuesUrl, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token.access_token}`,
          Accept: "application/json",
        },
      });

      if (!issuesResponse.ok) {
        const errorText = await issuesResponse.text();
        return NextResponse.json(
          { error: "Failed to fetch issues", details: errorText },
          { status: issuesResponse.status }
        );
      }

      const issuesData = await issuesResponse.json();

      // On the first page, record the total number of issues.
      if (startAt === 0) {
        total = issuesData.total;
      }

      // Append this page of issues to our aggregated list.
      allIssues = allIssues.concat(issuesData.issues);

      // Move to the next page.
      startAt += maxResults;
    } while (startAt < total);

    // Filter out only epics.
    const filteredIssues = allIssues.filter((issue) => {
      return issue.fields.issuetype.name === "Epic";
    });

    console.log("Fetched Jira issues:", filteredIssues);

    // Return the filtered issues data.
    return NextResponse.json(filteredIssues);
  } catch (error) {
    return NextResponse.json(
      { error: "Error fetching issues", details: error.message || error },
      { status: 500 }
    );
  }
}
