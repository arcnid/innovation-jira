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
			// created_at is set automatically by default if defined in your table schema
		},
	]);

	if (error) {
		throw new Error(`Error saving token: ${error.message}`);
	}
	return data;
}

/**
 * Retrieve the most recently stored token.
 * (You can customize this query to suit your needs.)
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
 * Update the stored token (e.g., after refreshing)
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
