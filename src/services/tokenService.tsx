// services/tokenService.js
import { getSupabaseClient } from "../lib/supabaseClient";

/**
 * Save token data to the database.
 */
export async function saveToken(tokenData) {
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
export async function updateToken(id, newTokenData) {
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
 * Refresh the token using the stored refresh token.
 * This function always calls the refresh endpoint and updates the token in the database.
 */
export async function refreshToken() {
	// Get the current token (should contain a refresh token)
	const token = await getLatestToken();
	if (!token || !token.refresh_token) {
		throw new Error("No refresh token available");
	}

	// Retrieve OAuth configuration from environment variables
	const client_id = process.env.CLIENT_ID;
	const client_secret = process.env.CLIENT_SECRET;

	if (!client_id || !client_secret) {
		throw new Error("Missing OAuth client configuration");
	}

	// Call the refresh endpoint
	const refreshResponse = await fetch(
		"https://auth.atlassian.com/oauth/token",
		{
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({
				grant_type: "refresh_token",
				client_id,
				client_secret,
				refresh_token: token.refresh_token,
			}),
		}
	);

	if (!refreshResponse.ok) {
		const errorText = await refreshResponse.text();
		throw new Error(`Failed to refresh token: ${errorText}`);
	}

	const refreshedTokenData = await refreshResponse.json();

	// Update token in the database with the refreshed token data
	await updateToken(token.id, refreshedTokenData);

	return refreshedTokenData;
}

/**
 * Retrieve the accessible resources from Atlassian and
 * craft the Jira API URL.
 * This function now automatically refreshes the token before making the request.
 */
export async function getRequestUrl() {
	// Refresh the token to ensure it is valid
	const refreshedTokenData = await refreshToken();

	// Use the new access token to fetch accessible resources
	const response = await fetch(
		"https://api.atlassian.com/oauth/token/accessible-resources",
		{
			method: "GET",
			headers: {
				"Content-Type": "application/json",
				Authorization: `Bearer ${refreshedTokenData.access_token}`,
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

	// Pick a site (for example, the first one) and craft the Jira API URL
	const site = resources[0];
	const siteId = site.id;
	const jiraApiUrl = `https://api.atlassian.com/ex/jira/${siteId}/rest/api`;

	// Save or update the site record in Supabase
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
