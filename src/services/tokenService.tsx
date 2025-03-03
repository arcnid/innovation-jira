// services/tokenService.js
import { getSupabaseClient } from "../lib/supabaseClient";

/**
 * Save token data to the database.
 * tokenData is expected to be an object like:
 * {
 *   access_token: string,
 *   refresh_token: string, // may be null if not provided
 *   token_type: string,
 *   scope: string,
 *   expires_in: number
 * }
 */
export async function saveToken(tokenData: any) {
	const supabase = getSupabaseClient();
	const { data, error } = await supabase.from("tokens").insert([
		{
			access_token: tokenData.access_token,
			refresh_token: tokenData.refresh_token,
			token_type: tokenData.token_type,
			scope: tokenData.scope,
			expires_in: tokenData.expires_in,
			// created_at is auto-set if defined in your table schema
		},
	]);

	if (error) {
		throw new Error(`Error saving token: ${error.message}`);
	}
	return data;
}

/**
 * Retrieve the most recently stored token.
 */
export async function getLatestToken() {
	const supabase = getSupabaseClient();
	const { data, error } = await supabase
		.from("tokens")
		.select("*")
		.order("created_at", { ascending: false })
		.limit(1);

	if (error) {
		throw new Error(`Error fetching token: ${error.message}`);
	}
	return data[0];
}

/**
 * Update the stored token (e.g., after refreshing).
 */
export async function updateToken(id: any, newTokenData: any) {
	const supabase = getSupabaseClient();
	const { data, error } = await supabase
		.from("tokens")
		.update({
			access_token: newTokenData.access_token,
			refresh_token: newTokenData.refresh_token,
			token_type: newTokenData.token_type,
			scope: newTokenData.scope,
			expires_in: newTokenData.expires_in,
		})
		.eq("id", id);

	if (error) {
		throw new Error(`Error updating token: ${error.message}`);
	}
	return data;
}

/**
 * Retrieve the accessible resources from Atlassian and
 * craft the Jira API URL.
 * Also updates (or creates) a site record in the database.
 */
export async function getRequestUrl() {
	// 1. Get the stored token
	const token = await getLatestToken();
	if (!token || !token.access_token) {
		throw new Error("No valid token found");
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
		throw new Error(`Failed to fetch accessible resources: ${errorText}`);
	}

	const resources = await response.json();
	if (!resources || resources.length === 0) {
		throw new Error("No accessible resources found");
	}

	// 3. Pick a site (for example, the first one) and craft the Jira API URL
	const site = resources[0];
	const siteId = site.id;
	const jiraApiUrl = `https://api.atlassian.com/ex/jira/${siteId}/rest/api`;

	// 4. Save or update the site record in Supabase
	const supabase = getSupabaseClient();
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
		//working
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

	return jiraApiUrl;
}
