// pages/api/auth.js
import { NextResponse, NextRequest } from "next/server";
import {
	getLatestToken,
	saveToken,
	updateToken,
	getRequestUrl,
} from "@/services/tokenService";

export async function GET(req: NextRequest) {
	// Parse query parameters from the incoming URL
	const { searchParams } = new URL(req.url);
	const code = searchParams.get("code");
	const error = searchParams.get("error");

	console.log("Request received:", req.url);

	// Handle any OAuth error
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

	// Retrieve OAuth configuration from environment variables
	const client_id = process.env.CLIENT_ID;
	const client_secret = process.env.CLIENT_SECRET;
	const redirect_uri = process.env.REDIRECT_URI; // Must match your auth URL

	console.log(client_id, client_secret, redirect_uri);

	if (!client_id || !client_secret || !redirect_uri) {
		return NextResponse.json(
			{ error: "Missing OAuth configuration" },
			{ status: 500 }
		);
	}

	// Use the correct token endpoint for Atlassian Cloud
	const tokenEndpoint = "https://auth.atlassian.com/oauth/token";

	// Prepare the request body for exchanging the authorization code for tokens
	const body = new URLSearchParams();
	body.append("client_id", client_id);
	body.append("client_secret", client_secret);
	body.append("code", code);
	body.append("grant_type", "authorization_code");
	body.append("redirect_uri", redirect_uri);

	try {
		console.log("Exchanging code for token...");

		// Make a POST request to exchange the code for an access token
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

		// Check if a token already exists and update, otherwise save as new
		const existingToken = await getLatestToken();
		if (existingToken) {
			await updateToken(existingToken.id, tokenData);
		} else {
			await saveToken(tokenData);
		}

		console.log("Token exchange successful", tokenData);

		// Craft the Jira API URL based on the accessible resources
		const newUrl = await getRequestUrl();
		console.log("Crafted Jira API URL:", newUrl);

		// Return a combined response with token info and the Jira API URL
		return NextResponse.json({ token: tokenData, jiraApiUrl: newUrl });
	} catch (err) {
		return NextResponse.json(
			{
				error: "Error during token exchange",
				details: err,
			},
			{ status: 500 }
		);
	}
}
