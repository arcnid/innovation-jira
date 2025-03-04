import { getLatestToken, getRequestUrl } from "@/services/tokenService";
import { getSupabaseClient } from "@/lib/supabaseClient";

export const projectService = {
  getAllprojects: async () => {
    try {
      const baseJiraUrl = await getRequestUrl();
      const projectsUrl = `${baseJiraUrl}/3/project`;

      // Retrieve the latest access token for authorization
      const token = await getLatestToken();
      if (!token || !token.access_token) {
        console.log("No token found");
        return;
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
        console.log("Failed to fetch projects", errorText);
        return;
      }

      const projects = await projectListResponse.json();

      return projects;
    } catch (e) {
      console.log(e);
    }
  },
  getFormattedProjectList: async () => {
    try {
      const baseJiraUrl = await getRequestUrl();
      const projectsUrl = `${baseJiraUrl}/3/project`;

      // Retrieve the latest access token for authorization
      const token = await getLatestToken();
      if (!token || !token.access_token) {
        console.log("No token found");
        return;
      }

      // Refresh token logic can be added here if needed
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
        console.log("Failed to fetch projects", errorText);
        return;
      }

      const projects = await projectListResponse.json();

      // Format the project list to only include id, key, name, and lead
      const formattedProjects = projects.map((project) => ({
        id: project.id,
        key: project.key,
        name: project.name,
        lead: project.lead,
      }));

      return formattedProjects;
    } catch (e) {
      console.log(e);
    }
  },
};
