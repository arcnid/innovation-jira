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
      const formattedProjects = projects
        .filter((project) => project.isPrivate === false)
        .map((project) => ({
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

  getProjectLead: async (projectId) => {
    // we will need to query the project lead from the project object
    try {
      const baseJiraUrl = await getRequestUrl();
      const projectUrl = `${baseJiraUrl}/3/project/${projectId}`;

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

      // Fetch the project details
      const projectResponse = await fetch(projectUrl, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token.access_token}`,
          Accept: "application/json",
        },
      });

      if (!projectResponse.ok) {
        const errorText = await projectResponse.text();
        console.log("Failed to fetch project", errorText);
        return;
      }

      const project = await projectResponse.json();

      return project.lead;
    } catch (e) {
      console.log(e);
    }
  },

  getProjectsWithLead: async () => {
    //jira does not place the product lead in the project object so we need to promise all and query each projkect individuaslly and reduce the data
    const projects = await projectService.getAllprojects();
    const projectsWithLead = await Promise.all(
      projects.map(async (project) => {
        const lead = await projectService.getProjectLead(project.id);
        return { ...project, lead };
      })
    );

    return projectsWithLead;
  },
  getAllProjectleads: async () => {
    const projectsWithLead = await projectService.getProjectsWithLead();
    const projectLeads = projectsWithLead.map(
      (project) => project.lead.displayName
    );
    return projectLeads;
  },
};
