"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import useSWR from "swr";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import {
  CheckCircle,
  XCircle,
  Clock,
  MessageSquare,
  FileText,
  Lightbulb,
  BarChart,
  FileCode,
  Book,
  Rocket,
  Calendar,
  FileIcon,
  Download,
  BookOpen,
  Search,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Input } from "@/components/ui/input";

// SWR fetcher function.
const fetcher = (url) => fetch(url).then((res) => res.json());

const StageIcon = ({ stage, index }) => {
  const icons = [Lightbulb, BarChart, FileText, FileCode, Book, Rocket];
  const Icon = icons[index];
  return (
    <div
      className={`rounded-full p-2 ${
        stage.status === "approved"
          ? "bg-green-100 text-green-600"
          : stage.status === "in-progress"
          ? "bg-blue-100 text-blue-600"
          : "bg-gray-100 text-gray-400"
      }`}
    >
      <Icon className="h-6 w-6" />
    </div>
  );
};

const StageStatus = ({ status }) => {
  switch (status) {
    case "approved":
      return <CheckCircle className="h-5 w-5 text-green-500" />;
    case "denied":
      return <XCircle className="h-5 w-5 text-red-500" />;
    case "in-progress":
      return <Clock className="h-5 w-5 text-blue-500" />;
    default:
      return <Clock className="h-5 w-5 text-gray-300" />;
  }
};

export default function IdeaTracker() {
  // Get URL params with useParams hook.
  const params = useParams();
  const issueId = params.isssueId; // note: the param is named "isssueId" per your API

  console.log("Rendering IdeaTracker with id:", issueId);
  console.log("params:", params);

  // Use SWR for caching and fetching data.
  const { data: swrData, error } = useSWR(
    issueId ? `/api/ideas/${issueId}` : null,
    fetcher,
    {
      refreshInterval: 60000, // Auto-refresh every 60 seconds
      dedupingInterval: 30000, // Prevent duplicate requests within 30 seconds
    }
  );

  // Local state for our idea data.
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (swrData) {
      // Define static stage names exactly as in Jira.
      const staticStages = [
        { id: 1, name: "Concept Ideation Planning Process" },
        { id: 2, name: "New Business Impact Analysis Process" },
        { id: 3, name: "New Product Project Formulation" },
        { id: 4, name: "New Product Prototyping/Execution" },
        { id: 5, name: "New Product Pre-Production" },
        { id: 6, name: "New Product Close-Out/Release" },
      ];

      // For each static stage, find the matching child ticket (by comparing summary).
      const stagesFromChildren = staticStages.map((stage) => {
        const matchingChild = swrData.children.find(
          (child) => child.fields.summary === stage.name
        );
        if (matchingChild) {
          const childStatusRaw = matchingChild.fields.status.name.toLowerCase();
          let normalizedStatus = "pending";
          if (childStatusRaw === "done" || childStatusRaw === "complete") {
            normalizedStatus = "approved";
          } else if (childStatusRaw === "in progress") {
            normalizedStatus = "in-progress";
          }

          return {
            id: stage.id,
            name: stage.name,
            status: normalizedStatus,
            completedDate: matchingChild.fields.resolutiondate || null,
            feedback:
              (matchingChild.fields.comment &&
                Array.isArray(matchingChild.fields.comment.comments) &&
                matchingChild.fields.comment.comments.length > 0 &&
                matchingChild.fields.comment.comments[0].body) ||
              "",
          };
        }
        // If no matching child ticket is found, return the static stage with default values.
        return {
          ...stage,
          status: "pending",
          completedDate: null,
          feedback: "",
        };
      });

      // Ensure project description is always a string.
      let projectDescription = "No description provided";
      if (typeof swrData.fields.description === "string") {
        projectDescription = swrData.fields.description;
      } else if (swrData.fields.description?.content) {
        projectDescription =
          swrData.fields.description.content
            ?.flatMap((block) => block.content?.map((c) => c.text))
            ?.join(" ") || "No description provided";
      }

      setData({
        id: swrData.key,
        title: swrData.fields.summary || swrData.key,
        submitter:
          swrData.submitter ||
          (swrData.fields &&
            swrData.fields.reporter &&
            swrData.fields.reporter.displayName) ||
          "",
        submissionDate: swrData.submissionDate || swrData.created,
        expectedTimeline: swrData.expectedTimeline || "Q1 2025 - Q4 2025",
        projectDescription, // Fixed description handling
        supportingDocuments: swrData.supportingDocuments || [],
        stages: stagesFromChildren,
      });
      setLoading(false);
    }
  }, [swrData, issueId]);

  if (error) {
    return <div className="text-red-500 text-center">Error loading data.</div>;
  }

  // Calculate the dynamic current stage based on how many stages are approved.
  const currentStage =
    data && data.stages
      ? data.stages.filter((s) => s.status === "approved").length
      : 0;

  /* ----------------- HEADER / NAVIGATION ----------------- */
  // Desktop Header (kept as before)
  const desktopHeader = (
    <header className="hidden md:flex sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 px-4 md:px-8 h-16 items-center justify-between">
      <Link href="/" className="flex items-center space-x-2 hover:underline">
        <BookOpen className="h-6 w-6" />
        <span className="inline-block font-bold">Sioux Steel Wiki</span>
      </Link>
      <div className="flex flex-1 items-center justify-end space-x-4">
        <nav className="flex items-center space-x-2 ml-4">
          <Link href="/">
            <Button variant="ghost" size="sm">
              Home
            </Button>
          </Link>
          <Link href="/ideas">
            <Button variant="ghost" size="sm">
              Ideas List
            </Button>
          </Link>
          <Link href="/create">
            <Button variant="ghost" size="sm">
              Submit Idea
            </Button>
          </Link>
          <Link href="/ssc-admin">
            <Button variant="ghost" size="sm">
              Admin
            </Button>
          </Link>
        </nav>
      </div>
    </header>
  );

  // Mobile Header (optimized for mobile with reduced margins and evenly spaced nav buttons)
  const mobileHeader = (
    <header className="md:hidden sticky top-0 z-50 w-full bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 px-4 py-2">
      {/* Top Row: Title */}
      <div className="flex items-center justify-between">
        <Link href="/" className="flex items-center space-x-2">
          <BookOpen className="h-6 w-6" />
          <span className="text-xl font-bold">Sioux Steel Wiki</span>
        </Link>
      </div>
      {/* Navigation Row */}
      <nav className="flex justify-around mt-2">
        <Link href="/">
          <Button variant="ghost" size="sm">
            Home
          </Button>
        </Link>
        <Link href="/ideas">
          <Button variant="ghost" size="sm">
            Ideas List
          </Button>
        </Link>
        <Link href="/create">
          <Button variant="ghost" size="sm">
            Submit Idea
          </Button>
        </Link>
        <Link href="/ssc-admin">
          <Button variant="ghost" size="sm">
            Admin
          </Button>
        </Link>
      </nav>
    </header>
  );

  // Use the appropriate header based on viewport.
  const headerComponent = (
    <>
      {desktopHeader}
      {mobileHeader}
    </>
  );

  /* ----------------- MAIN CONTENT ----------------- */
  return (
    <div className="flex min-h-screen flex-col bg-gradient-to-br from-background to-secondary/20">
      {headerComponent}
      <main className="flex-1 py-8">
        <div className="container mx-auto px-4 md:px-8">
          <Card className="mb-8">
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-2xl">
                    {loading ? <Skeleton width={300} /> : data.title}
                  </CardTitle>
                  <CardDescription>
                    Issue ID: {loading ? <Skeleton width={100} /> : data.id}
                  </CardDescription>
                </div>
                <Badge
                  variant={
                    loading
                      ? "default"
                      : currentStage === 6
                      ? "default"
                      : "secondary"
                  }
                >
                  {loading ? (
                    <Skeleton width={80} />
                  ) : (
                    `Stage ${currentStage} of 6`
                  )}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex items-center space-x-4 mb-4">
                <Avatar>
                  {loading ? (
                    <Skeleton circle height={40} width={40} />
                  ) : (
                    <>
                      <AvatarImage src="/avatars/01.png" alt={data.submitter} />
                      <AvatarFallback>
                        {data.submitter
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </>
                  )}
                </Avatar>
                <div>
                  <p className="font-medium">
                    {loading ? <Skeleton width={150} /> : data.submitter}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {loading ? (
                      <Skeleton width={100} />
                    ) : (
                      `Submitted on ${data.submissionDate}`
                    )}
                  </p>
                </div>
              </div>
              {loading ? (
                <Skeleton height={8} width="100%" />
              ) : (
                <Progress value={(currentStage / 6) * 100} className="mb-4" />
              )}
            </CardContent>
          </Card>

          <div className="flex flex-col lg:flex-row gap-8">
            {/* Left side: Stage Flow (Timeline) */}
            <div className="w-full lg:w-1/2">
              <h2 className="text-xl font-semibold mb-4">Project Stages</h2>
              <div className="relative">
                {loading
                  ? Array.from({ length: 6 }).map((_, i) => (
                      <div key={i} className="flex items-center mb-4">
                        <div className="w-1/3 text-right pr-4">
                          <Skeleton width={150} />
                        </div>
                        <div className="relative">
                          <Skeleton circle height={48} width={48} />
                        </div>
                        <div className="w-1/2 pl-4">
                          <Skeleton width={120} />
                        </div>
                      </div>
                    ))
                  : data.stages.map((stage, index) => (
                      <div key={index} className="flex items-center mb-4">
                        <div className="w-1/3 text-right pr-4">
                          <p className="font-medium text-sm">{stage.name}</p>
                          {stage.completedDate && (
                            <p className="text-xs text-muted-foreground">
                              {stage.completedDate}
                            </p>
                          )}
                        </div>
                        <div className="relative">
                          <div
                            className={`w-12 h-12 rounded-full flex items-center justify-center ${
                              stage.status === "approved"
                                ? "bg-green-100"
                                : stage.status === "in-progress"
                                ? "bg-blue-100"
                                : "bg-gray-100"
                            }`}
                          >
                            <StageIcon stage={stage} index={index} />
                          </div>
                          {index < data.stages.length - 1 && (
                            <div className="absolute top-12 left-1/2 w-0.5 h-12 bg-gray-300" />
                          )}
                        </div>
                        <div className="w-1/2 pl-4">
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <div
                                  className={`inline-flex items-center space-x-2 rounded-full px-3 py-1 text-xs font-medium ${
                                    stage.status === "approved"
                                      ? "bg-green-100 text-green-800"
                                      : stage.status === "in-progress"
                                      ? "bg-blue-100 text-blue-800"
                                      : "bg-gray-100 text-gray-800"
                                  }`}
                                >
                                  <StageStatus status={stage.status} />
                                  <span>
                                    {stage.status === "approved"
                                      ? "Approved"
                                      : stage.status === "in-progress"
                                      ? "In Progress"
                                      : "Pending"}
                                  </span>
                                </div>
                              </TooltipTrigger>
                              <TooltipContent>
                                <p>
                                  {stage.feedback ||
                                    "No feedback available yet."}
                                </p>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                          {stage.status === "in-progress" && (
                            <Button
                              variant="outline"
                              size="sm"
                              className="mt-2"
                            >
                              <MessageSquare className="mr-2 h-4 w-4" />
                              Provide Input
                            </Button>
                          )}
                        </div>
                      </div>
                    ))}
              </div>
            </div>

            {/* Right side: Project Details */}
            <div className="w-full lg:w-1/2 space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Calendar className="mr-2 h-5 w-5" />
                    Expected Timeline
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {loading ? (
                    <Skeleton width="100%" />
                  ) : (
                    // Display timeline data. This could be enhanced further with a timeline view.
                    <p>{data.expectedTimeline}</p>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <FileText className="mr-2 h-5 w-5" />
                    Project Description
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {loading ? (
                    <Skeleton count={3} />
                  ) : (
                    <p>{data.projectDescription}</p>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <FileIcon className="mr-2 h-5 w-5" />
                    Supporting Documents
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {loading ? (
                    <Skeleton count={2} />
                  ) : data.supportingDocuments.length === 0 ? (
                    <p>No supporting documents available.</p>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                      {data.supportingDocuments.map((doc, index) => (
                        <div
                          key={index}
                          className="border p-4 rounded-md shadow-sm flex flex-col justify-between"
                        >
                          <div>
                            <h4 className="font-semibold text-lg mb-1">
                              {doc.name}
                            </h4>
                            <p className="text-sm text-muted-foreground">
                              {doc.type.toUpperCase()}
                            </p>
                          </div>
                          <div className="mt-2 flex items-center justify-between">
                            <span className="text-sm text-muted-foreground">
                              {doc.size}
                            </span>
                            <Button variant="ghost" size="sm">
                              <Download className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
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
