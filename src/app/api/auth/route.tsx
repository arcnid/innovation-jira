import { NextResponse, NextRequest } from "next/server";

export async function GET(req: NextRequest) {
	// Parse the query parameters from the incoming URL
	console.log(req);
	const { searchParams } = new URL(req.url);
	const code = searchParams.get("code");
	const state = searchParams.get("state");
	const error = searchParams.get("error");

	// If Jira returned an error, respond with it
	if (error) {
		return NextResponse.json(
			{ error: `OAuth error: ${error}` },
			{ status: 400 }
		);
	}

	// Ensure that we received the authorization code
	if (!code) {
		return NextResponse.json(
			{ error: "Authorization code not found" },
			{ status: 400 }
		);
	}

	// At this point, you might want to verify the state parameter to prevent CSRF

	// Retrieve OAuth configuration from environment variables
	const client_id = process.env.CLIENT_ID;
	const client_secret = process.env.CLIENT_SECRET;
	const redirect_uri = process.env.REDIRECT_URI; // Must match the one used in the initial request
	const code_verifier = process.env.CODE_VERIFIER; // If you're using PKCE

	if (!client_id || !client_secret || !redirect_uri) {
		return NextResponse.json(
			{ error: "Missing OAuth configuration" },
			{ status: 500 }
		);
	}

	// Build the token endpoint URL (replace with your actual Jira instance URL)
	const tokenEndpoint = "https://jira.atlassian.com/rest/oauth2/latest/token";

	// Prepare the request body for exchanging the authorization code for tokens
	const body = new URLSearchParams();
	body.append("client_id", client_id);
	body.append("client_secret", client_secret);
	body.append("code", code);
	body.append("grant_type", "authorization_code");
	body.append("redirect_uri", redirect_uri);
	if (code_verifier) {
		body.append("code_verifier", code_verifier);
	}

	try {
		// Make a POST request to the token endpoint to exchange the code for an access token
		const tokenRes = await fetch(tokenEndpoint, {
			method: "POST",
			headers: {
				"Content-Type": "application/x-www-form-urlencoded",
			},
			body: body.toString(),
		});

		if (!tokenRes.ok) {
			const errData = await tokenRes.text();
			return NextResponse.json(
				{ error: "Failed to fetch token", details: errData },
				{ status: tokenRes.status }
			);
		}

		const tokenData = await tokenRes.json();

		// Here, you could store tokenData in a session, database, or secure cookie.
		// For now, we simply return the token response.
		return NextResponse.json(tokenData);
	} catch (err) {
		return NextResponse.json(
			{ error: "Error during token exchange", details: err },
			{ status: 500 }
		);
	}
}
