// pages/api/projects.js
import { NextResponse, NextRequest } from "next/server";
import { getLatestToken, getRequestUrl } from "@/services/tokenService";
import { getSupabaseClient } from "@/lib/supabaseClient";

export async function GET(req: NextRequest) {
	try {
		// Build the base Jira API URL and update the site record
		const baseJiraUrl = await getRequestUrl();
		const projectsUrl = `${baseJiraUrl}/3/project`;

		// Retrieve the latest access token for authorization
		const token = await getLatestToken();
		if (!token || !token.access_token) {
			return NextResponse.json(
				{ error: "Access token not found" },
				{ status: 401 }
			);
		}

		//we need to see if the token is still valid

		//refresh the token if needed
		//get refresh token from supabase
		const supabase = getSupabaseClient();
		const { data: tokenData, error: tokenError } = await supabase
			.from("tokens")
			.select("*")
			.single();

		// Fetch the list of projects
		const projectListResponse = await fetch(projectsUrl, {
			method: "GET",
			headers: {
				Authorization: `Bearer ${token.access_token}`,
				Accept: "application/json",
			},
		});

		if (!projectListResponse.ok) {
			const errorText = await projectListResponse.text();
			return NextResponse.json(
				{ error: "Failed to fetch projects", details: errorText },
				{ status: projectListResponse.status }
			);
		}

		const projects = await projectListResponse.json();

		// Fetch detailed info for each project concurrently
		const detailedProjects = await Promise.all(
			projects.map(async (project: any) => {
				try {
					const projectDetailUrl = `${baseJiraUrl}/3/project/${project.id}`;
					const detailResponse = await fetch(projectDetailUrl, {
						method: "GET",
						headers: {
							Authorization: `Bearer ${token.access_token}`,
							Accept: "application/json",
						},
					});

					if (!detailResponse.ok) {
						return { ...project, error: "Failed to fetch project details" };
					}

					const projectDetails = await detailResponse.json();
					return { ...project, details: projectDetails };
				} catch (error) {
					return {
						...project,
						error: "Error fetching project details",
						details: error.message,
					};
				}
			})
		);

		// Chain another Promise.all to fetch statuses for each project concurrently
		const projectsWithStatuses = await Promise.all(
			detailedProjects.map(async (project) => {
				try {
					const statusesUrl = `${baseJiraUrl}/3/project/${project.id}/statuses`;
					const statusesResponse = await fetch(statusesUrl, {
						method: "GET",
						headers: {
							Authorization: `Bearer ${token.access_token}`,
							Accept: "application/json",
						},
					});

					if (!statusesResponse.ok) {
						return {
							...project,
							statusesError: "Failed to fetch project statuses",
						};
					}

					const statuses = await statusesResponse.json();
					return { ...project, statuses };
				} catch (error) {
					return {
						...project,
						statusesError: "Error fetching project statuses",
						statuses: error.message,
					};
				}
			})
		);

		// Return the final combined response with project details and statuses
		return NextResponse.json(projectsWithStatuses);
	} catch (error) {
		return NextResponse.json(
			{ error: "Error fetching projects", details: error.message || error },
			{ status: 500 }
		);
	}
}
