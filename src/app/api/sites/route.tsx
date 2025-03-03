// pages/api/accessible-resources.js
import { NextResponse, NextRequest } from "next/server";
import { getLatestToken } from "@/services/tokenService";

export async function GET(req: NextRequest) {
	try {
		// Retrieve the most recent token from your database
		const token = await getLatestToken();
		if (!token || !token.access_token) {
			return NextResponse.json(
				{ error: "No valid token found" },
				{ status: 400 }
			);
		}

		// Make a GET request to the accessible-resources endpoint
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

		const data = await response.json();

		console.log("sites", data);
		return NextResponse.json(data);
	} catch (error) {
		return NextResponse.json(
			{ error: "Error fetching accessible resources", details: error },
			{ status: 500 }
		);
	}
}
