"use client";
import { useState, useRef } from "react";
import Link from "next/link";
import useSWR from "swr";
import {
  BookOpen,
  Lightbulb,
  LightbulbOff,
  Clock,
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

// Fallback icon if no avatar is provided.
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

// Updated mapping function that extracts additional fields from the incoming Jira issue data.
const mapIdeaToUI = (issue) => {
  const fields = issue.fields;

  // Extract description safely
  let description = "No description provided";
  if (typeof fields.description === "string") {
    description = fields.description;
  } else if (fields.description?.content) {
    // Extract first paragraph text if available
    description =
      fields.description.content
        ?.flatMap((block) => block.content?.map((c) => c.text))
        ?.join(" ") || "No description provided";
  }

  // Determine timeframe based on customfield_10017
  let timeframe = "long";
  if (fields.customfield_10017 === "green") {
    timeframe = "quick";
  } else if (fields.customfield_10017 === "dark_blue") {
    timeframe = "medium";
  }

  // Choose an icon based on the timeframe
  let icon = Lightbulb;
  if (timeframe === "quick") {
    icon = Clock;
  }

  return {
    id: issue.id,
    key: issue.key,
    title: fields.summary || "No Title",
    description, // Now always a string
    submittedBy: fields.reporter ? fields.reporter.displayName : "Unknown",
    assignee: fields.assignee ? fields.assignee.displayName : "Unassigned",
    created: fields.created,
    updated: fields.updated,
    status: fields.status?.name || "Unknown",
    priority: fields.priority?.name || "Unknown",
    timeframe,
    icon,
    detailUrl: `/ideas/${issue.key}`,
    categories: fields.customfield_10131 || [],
  };
};

// SWR fetcher
const fetcher = (url) => fetch(url).then((res) => res.json());

export default function IdeaPipelinePage() {
  // Fetch idea submissions from an API endpoint.
  const { data, error } = useSWR("/api/ideas", fetcher, {
    refreshInterval: 60000,
    dedupingInterval: 30000,
  });

  console.log(data, error);

  // Map ideas and filter out any if needed.
  const ideas = data ? data.map(mapIdeaToUI) : [];

  // Get unique submitters.
  const submitters = data
    ? Array.from(new Set(ideas.map((idea) => idea.submittedBy)))
    : [];

  const [selectedSubmitter, setSelectedSubmitter] = useState("all");
  const [selectedPipeline, setSelectedPipeline] = useState("all"); // e.g., "quick", "medium", "long"
  const sliderRef = useRef(null);
  const isLoading = !data;

  // Filter ideas based on submitter.
  const filteredIdeas =
    selectedSubmitter === "all"
      ? ideas
      : ideas.filter((idea) => idea.submittedBy === selectedSubmitter);

  // Further breakdown the filtered ideas by pipeline stage.
  const pipelineIdeas =
    selectedPipeline === "all"
      ? filteredIdeas
      : filteredIdeas.filter((idea) => idea.timeframe === selectedPipeline);

  // Functions to scroll the idea cards horizontally.
  const nextIdea = () => {
    if (sliderRef.current) {
      sliderRef.current.scrollBy({ left: 320, behavior: "smooth" });
    }
  };

  const prevIdea = () => {
    if (sliderRef.current) {
      sliderRef.current.scrollBy({ left: -320, behavior: "smooth" });
    }
  };

  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="w-full px-4 md:px-8 flex h-16 items-center justify-between">
          <Link href="/" className="flex items-center space-x-2">
            <BookOpen className="h-6 w-6" />
            <span className="font-bold">Company Wiki</span>
          </Link>
        </div>
      </header>

      <main className="flex-1 py-8">
        <div className="w-full max-w-5xl px-4 md:px-8 mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-extrabold md:text-4xl">
              Idea Pipeline Overview
            </h1>
            <p className="mt-2 text-lg text-muted-foreground">
              See how submitted ideas are stacking up and track their estimated
              implementation timelines.
            </p>
          </div>

          <div className="mb-6 flex items-center justify-between">
            {/* Filter by Submitter */}
            <Select
              value={selectedSubmitter}
              onValueChange={setSelectedSubmitter}
            >
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="Select Submitter" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Submitters</SelectItem>
                {submitters.map((submitter) => (
                  <SelectItem key={submitter} value={submitter}>
                    {submitter}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Filter by Pipeline (e.g., timeframe) */}
            <Select
              value={selectedPipeline}
              onValueChange={setSelectedPipeline}
            >
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="Select Pipeline Stage" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Ideas</SelectItem>
                <SelectItem value="quick">Quick Win (1-3 months)</SelectItem>
                <SelectItem value="medium">Medium Term (3-6 months)</SelectItem>
                <SelectItem value="long">Long Term (6+ months)</SelectItem>
              </SelectContent>
            </Select>

            <div className="flex items-center space-x-2">
              <Button variant="outline" size="icon" onClick={prevIdea}>
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="icon" onClick={nextIdea}>
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Horizontal slider for idea cards */}
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
                        <Skeleton circle height={16} width={16} />
                        <Skeleton height={16} width="40%" />
                      </div>
                      <div className="mt-2">
                        <Skeleton count={2} />
                      </div>
                    </CardContent>
                    <CardFooter className="flex justify-between">
                      <Skeleton height={16} width="30%" />
                      <Skeleton height={16} width="30%" />
                    </CardFooter>
                  </Card>
                ))
              : pipelineIdeas.map((idea) => (
                  <Card
                    key={idea.id}
                    className="flex-shrink-0 w-[300px] flex flex-col justify-between"
                  >
                    <CardHeader>
                      <div className="flex items-center space-x-2">
                        {/* Show idea icon or avatar if available */}

                        <div>
                          <CardTitle className="mt-2">{idea.title}</CardTitle>
                          <span className="text-xs text-muted-foreground">
                            {idea.key}
                          </span>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                        <idea.icon className="h-4 w-4" />
                        <span>{idea.timeframe}</span>
                      </div>
                      <p className="mt-2 text-sm text-muted-foreground">
                        {idea.description}
                      </p>
                      <div className="mt-2 text-xs text-muted-foreground">
                        <div>Status: {idea.status}</div>
                        <div>Priority: {idea.priority}</div>
                        <div>Assignee: {idea.assignee}</div>
                      </div>
                    </CardContent>
                    <CardFooter className="flex justify-between">
                      <span className="text-xs text-muted-foreground">
                        Submitted by: {idea.submittedBy}
                      </span>
                      <Link href={idea.detailUrl}>
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
        <div className="w-full px-4 md:px-8 flex flex-col items-center justify-between gap-4 md:flex-row">
          <p className="text-center text-sm text-muted-foreground">
            &copy; {new Date().getFullYear()} Sioux Steel Co. All rights
            reserved.
          </p>
          <p className="text-center text-sm text-muted-foreground">
            Innovation at every step
          </p>
        </div>
      </footer>
    </div>
  );
}
