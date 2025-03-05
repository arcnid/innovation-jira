"use client";
import { useState, useRef } from "react";
import Link from "next/link";
import useSWR from "swr";
import {
  BookOpen,
  Lightbulb,
  Code,
  HelpCircle,
  BarChart3,
  Megaphone,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

// Define a fallback default icon as an inline SVG.
const DefaultAvatarIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="currentColor"
    viewBox="0 0 24 24"
    className="w-6 h-6 text-gray-500"
  >
    <path d="M12 12c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm0 2c-3.33 0-10 1.67-10 5v3h20v-3c0-3.33-6.67-5-10-5z" />
  </svg>
);

// Mapping function that pulls data directly from the JSON fields.
// It also constructs a URL for the actual Jira project page using the project key.
const mapProjectToUI = (project) => {
  let icon = Code; // default icon based on project type
  const categoryName = project.projectCategory?.name || "";

  if (categoryName.includes("Product Development")) {
    icon = Lightbulb;
  } else if (categoryName.includes("Administration")) {
    icon = BarChart3;
  } else if (categoryName.includes("Software Development")) {
    icon = Code;
  } else if (categoryName.includes("Internal System")) {
    icon = HelpCircle;
  } else if (categoryName.includes("Service Management")) {
    icon = Megaphone;
  }

  // Construct a browser URL for the project details.
  const jiraUrl = `https://siouxsteel.atlassian.net/projects/${project.key}`;

  // Try to extract the 48x48 avatar from the main avatarUrls or from details.avatarUrls.
  // If not found, we simply return null.
  const avatar =
    project.avatarUrls?.["48x48"] ||
    project.details?.avatarUrls?.["48x48"] ||
    null;

  return {
    name: project.name,
    key: project.key,
    description:
      project.details?.description ||
      project.projectCategory?.description ||
      "",
    department: project.projectCategory?.name || "General",
    icon: icon,
    lead: project.details?.lead?.displayName || "N/A",
    issueCount: project.details?.issueTypes
      ? project.details.issueTypes.length
      : 0,
    isPrivate: project.isPrivate,
    jiraUrl,
    avatar,
  };
};

// SWR fetcher function.
const fetcher = (url) => fetch(url).then((res) => res.json());

export default function DepartmentProjectsPage() {
  // Using SWR to cache and revalidate projects data.
  const { data, error } = useSWR("/api/projects", fetcher, {
    refreshInterval: 60000, // Revalidate every minute
    dedupingInterval: 30000, // Avoid duplicate requests within 30 seconds
  });

  // Map and filter projects once data is loaded.
  const projects = data
    ? data.map(mapProjectToUI).filter((project) => !project.isPrivate)
    : [];

  // Get unique assignees.
  const assignees = projects
    ? Array.from(new Set(projects.map((p) => p.lead)))
    : [];

  const [selectedAssignee, setSelectedAssignee] = useState("all");
  const sliderRef = useRef(null);
  const isLoading = !data;

  const filteredProjects =
    selectedAssignee === "all"
      ? projects
      : projects.filter((project) => project.lead === selectedAssignee);

  // Functions to scroll the slider container horizontally.
  const nextProject = () => {
    if (sliderRef.current) {
      sliderRef.current.scrollBy({ left: 320, behavior: "smooth" });
    }
  };

  const prevProject = () => {
    if (sliderRef.current) {
      sliderRef.current.scrollBy({ left: -320, behavior: "smooth" });
    }
  };

  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="w-full px-4 md:px-8 flex h-16 items-center justify-between">
          <div className="flex gap-6 md:gap-10">
            <Link href="/" className="flex items-center space-x-2">
              <BookOpen className="h-6 w-6" />
              <span className="inline-block font-bold">Company Wiki</span>
            </Link>
          </div>
          <div className="flex flex-1 items-center justify-end space-x-4">
            <nav className="flex items-center space-x-2">
              <Link href="/">
                <Button variant="ghost" size="sm">
                  Home
                </Button>
              </Link>
              <Link href="/create">
                <Button variant="ghost" size="sm">
                  Submit Idea
                </Button>
              </Link>
              {/* New Admin Navigation Link */}
              <Link href="/ssc-admin">
                <Button variant="ghost" size="sm">
                  Admin
                </Button>
              </Link>
            </nav>
          </div>
        </div>
      </header>

      <main className="flex-1 py-8">
        <div className="w-full max-w-5xl px-4 md:px-8 mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-extrabold leading-tight tracking-tighter md:text-4xl">
              Assignee Projects Overview
            </h1>
            <p className="mt-2 text-lg text-muted-foreground">
              A high-level view of current projects by assignee
            </p>
          </div>

          <div className="mb-6 flex items-center justify-between">
            <Select
              value={selectedAssignee}
              onValueChange={setSelectedAssignee}
            >
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="Select Assignee" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Assignees</SelectItem>
                {assignees.map((assignee) => (
                  <SelectItem key={assignee} value={assignee}>
                    {assignee}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <div className="flex items-center space-x-2">
              <Button variant="outline" size="icon" onClick={prevProject}>
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="icon" onClick={nextProject}>
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Horizontal slider container */}
          <div
            ref={sliderRef}
            className="flex space-x-6 overflow-x-auto scrollbar-hide"
          >
            {isLoading
              ? Array.from({ length: 3 }).map((_, index) => (
                  <Card key={index} className="flex-shrink-0 w-[300px]">
                    <CardHeader>
                      <CardTitle>
                        <Skeleton height={24} width="80%" />
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center space-x-2">
                        <Skeleton circle={true} height={16} width={16} />
                        <Skeleton height={16} width="40%" />
                      </div>
                      <div className="mt-2">
                        <Skeleton count={2} />
                      </div>
                      <div className="mt-4">
                        <Skeleton height={16} width="60%" />
                      </div>
                    </CardContent>
                    <CardFooter className="flex justify-between">
                      <Skeleton height={16} width="30%" />
                      <Skeleton height={16} width="30%" />
                    </CardFooter>
                  </Card>
                ))
              : filteredProjects.map((project) => (
                  <Card
                    key={project.key}
                    className="flex-shrink-0 w-[300px] flex flex-col justify-between"
                  >
                    <CardHeader>
                      <div className="flex items-center space-x-2">
                        {project.avatar ? (
                          <img
                            src={project.avatar}
                            className="h-10 w-10 rounded-full"
                            alt={`${project.name} avatar`}
                          />
                        ) : (
                          <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
                            <DefaultAvatarIcon />
                          </div>
                        )}
                        <CardTitle className="mt-2">{project.name}</CardTitle>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                        <project.icon className="h-4 w-4" />
                        <span>{project.department}</span>
                      </div>
                      {project.description && (
                        <p className="mt-2 text-sm text-muted-foreground">
                          {project.description}
                        </p>
                      )}
                      <div className="mt-4 text-sm text-muted-foreground">
                        <p>
                          <strong>Lead:</strong> {project.lead}
                        </p>
                        <p>
                          <strong>Issue Types:</strong> {project.issueCount}
                        </p>
                      </div>
                    </CardContent>
                    <CardFooter className="flex justify-between">
                      <span className="text-sm text-muted-foreground">
                        Jira: {project.key}
                      </span>
                      <Link
                        href={project.jiraUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <Button variant="ghost" size="sm">
                          View Details
                        </Button>
                      </Link>
                    </CardFooter>
                  </Card>
                ))}
          </div>
        </div>
      </main>

      <footer className="border-t py-6">
        <div className="w-full px-4 md:px-8 flex flex-col items-center justify-between gap-4 md:h-16 md:flex-row">
          <p className="text-center text-sm leading-loose text-muted-foreground md:text-left">
            &copy; {new Date().getFullYear()} Sioux Steel Co. All rights
            reserved.
          </p>
          <p className="text-center text-sm leading-loose text-muted-foreground md:text-left">
            Driving innovation across departments
          </p>
        </div>
      </footer>
    </div>
  );
}
