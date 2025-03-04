// pages/api/issues.js
import { NextResponse, NextRequest } from "next/server";
import { getLatestToken, getRequestUrl } from "@/services/tokenService";
import { getSupabaseClient } from "@/lib/supabaseClient";

export async function GET(req: NextRequest) {
	try {
		// Retrieve the base URL for Jira and set a default project key.
		const baseJiraUrl = await getRequestUrl();
		const projectKey = "GUARD"; // Replace with your actual project key or id.
		// Build the Jira search API URL.
		const issuesUrl = `${baseJiraUrl}/3/search?jql=project=${projectKey}&fields=*all`;

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
		// You can add further validation logic based on tokenData if needed.

		// Fetch the issues from Jira.
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

		// Mapping for customfield_10131 to a more human-readable "Qualified Hours Type"
		const qualifiedHoursMapping = {
			Development: "Development",
			Prototyping: "Prototyping",
			Documentation: "Documentation",
			Testing: "Testing",
			null: null,
			undefined: undefined,
		};

		// Iterate through each issue and add the new field "Qualified Hours Type"
		if (issuesData.issues && Array.isArray(issuesData.issues)) {
			issuesData.issues = issuesData.issues.map((issue) => {
				const rawQualifiedHours = issue.fields.customfield_10131;
				let qualifiedHoursType = null;
				// Check if the field is an array and contains a value.
				if (Array.isArray(rawQualifiedHours) && rawQualifiedHours.length > 0) {
					const rawValue = rawQualifiedHours[0];
					qualifiedHoursType = qualifiedHoursMapping[rawValue] || rawValue;
				}
				// Add new property to the fields object.
				issue.fields["Qualified Hours Type"] = qualifiedHoursType;
				return issue;
			});
		}

		// Return the complete issues data including the mapped "Qualified Hours Type".
		return NextResponse.json(issuesData);
	} catch (error) {
		return NextResponse.json(
			{ error: "Error fetching issues", details: error.message || error },
			{ status: 500 }
		);
	}
}
