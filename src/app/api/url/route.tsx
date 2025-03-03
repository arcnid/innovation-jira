// pages/api/craft-jira-url.js
import { NextResponse, NextRequest } from "next/server";
import { getLatestToken } from "@/services/tokenService";
import { getSupabaseClient } from "@/lib/supabaseClient";

export async function GET(req: NextRequest) {
	try {
		// 1. Retrieve the stored token
		const token = await getLatestToken();
		if (!token || !token.access_token) {
			return NextResponse.json(
				{ error: "No valid token found" },
				{ status: 400 }
			);
		}

		// 2. Fetch accessible resources from Atlassian
		const response = await fetch(
			"https://api.atlassian.com/oauth/token/accessible-resources",
			{
				method: "GET",
				headers: {
					"Content-Type": "application/json",
					Authorization: `Bearer ${token.access_token}`,
				},
			}
		);

		if (!response.ok) {
			const errorText = await response.text();
			return NextResponse.json(
				{
					error: "Failed to fetch accessible resources",
					details: errorText,
				},
				{ status: response.status }
			);
		}

		const resources = await response.json();

		if (!resources || resources.length === 0) {
			return NextResponse.json(
				{ error: "No accessible resources found" },
				{ status: 404 }
			);
		}

		// 3. Pick a site (using the first one here) and craft the Jira API URL
		const site = resources[0]; // customize this logic if needed
		const siteId = site.id;
		const jiraApiUrl = `https://api.atlassian.com/ex/jira/${siteId}/rest/api/2/project`;

		// 4. Save the site info (with the crafted URL) in Supabase
		const supabase = getSupabaseClient();

		// Check if a site record already exists
		const { data: existingSites, error: selectError } = await supabase
			.from("sites")
			.select("*")
			.limit(1);

		if (selectError) {
			throw new Error(`Error fetching site: ${selectError.message}`);
		}

		if (existingSites && existingSites.length > 0) {
			// Update the existing record
			const siteRecord = existingSites[0];
			const { error: updateError } = await supabase
				.from("sites")
				.update({
					site_id: siteId,
					name: site.name,
					url: site.url,
					jira_api_url: jiraApiUrl,
					scopes: site.scopes,
				})
				.eq("id", siteRecord.id);
			if (updateError) {
				throw new Error(`Error updating site record: ${updateError.message}`);
			}
		} else {
			// Insert a new record
			const { error: insertError } = await supabase.from("sites").insert([
				{
					site_id: siteId,
					name: site.name,
					url: site.url,
					jira_api_url: jiraApiUrl,
					scopes: site.scopes,
				},
			]);
			if (insertError) {
				throw new Error(`Error saving site record: ${insertError.message}`);
			}
		}

		// Return the crafted URL and site information
		return NextResponse.json({ jiraApiUrl, site });
	} catch (error) {
		return NextResponse.json(
			{
				error: "Error crafting Jira API URL",
				details: error,
			},
			{ status: 500 }
		);
	}
}
