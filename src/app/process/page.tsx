"use client";
import { useState } from "react";
import Link from "next/link";
import { BookOpen, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import StageFlow from "@/components/stageflow"; // Adjust the import path as needed

// Desktop header with navigation links.
const desktopHeader = (
  <header className="hidden md:flex sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur px-4 md:px-8 h-16 items-center justify-between">
    <Link href="/" className="flex items-center space-x-2">
      <BookOpen className="h-6 w-6" />
      <span className="inline-block font-bold">Sioux Steel Wiki</span>
    </Link>
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
        <Link href="/ssc-admin">
          <Button variant="ghost" size="sm">
            Admin
          </Button>
        </Link>
      </nav>
    </div>
  </header>
);

// Mobile header for smaller viewports.
const mobileHeader = (
  <header className="md:hidden sticky top-0 z-50 w-full bg-background/95 backdrop-blur px-4 py-2">
    <div className="flex items-center justify-between">
      <Link href="/" className="flex items-center space-x-2">
        <BookOpen className="h-6 w-6" />
        <span className="text-xl font-bold">Sioux Steel Wiki</span>
      </Link>
    </div>
    <nav className="flex justify-around mt-2">
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
      <Link href="/ssc-admin">
        <Button variant="ghost" size="sm">
          Admin
        </Button>
      </Link>
    </nav>
  </header>
);

export default function TutorialProcessPage() {
  const [selectedStage, setSelectedStage] = useState(null);

  // Sample static data for each process stage.
  const tutorialStages = [
    {
      id: 1,
      name: "Concept Ideation Planning Process",
      status: "approved",
      completedDate: "2023-01-10",
      feedback: "Brainstorming and concept selection complete.",
      description:
        "This stage is where initial ideas are generated and the core concept is established. It involves market research and team collaboration.",
    },
    {
      id: 2,
      name: "New Business Impact Analysis Process",
      status: "approved",
      completedDate: "2023-02-05",
      feedback: "Impact analysis complete.",
      description:
        "In this phase, the potential impact of the concept on business operations is assessed. Financial and operational risks are identified.",
    },
    {
      id: 3,
      name: "New Product Project Formulation",
      status: "in-progress",
      completedDate: null,
      feedback: "Formulation underway.",
      description:
        "Detailed project planning takes place in this stage, where scope, resources, and timelines are defined.",
    },
    {
      id: 4,
      name: "New Product Prototyping/Execution",
      status: "pending",
      completedDate: null,
      feedback: "",
      description:
        "Prototyping phase involves building and testing the product. Iterative development and refinement are key aspects.",
    },
    {
      id: 5,
      name: "New Product Pre-Production",
      status: "pending",
      completedDate: null,
      feedback: "",
      description:
        "The product is prepped for manufacturing. Final adjustments and quality assurance tests are conducted.",
    },
    {
      id: 6,
      name: "New Product Close-Out/Release",
      status: "pending",
      completedDate: null,
      feedback: "",
      description:
        "Finalization of the project and official product release. Post-launch reviews and documentation are completed.",
    },
  ];

  return (
    <div className="flex min-h-screen flex-col bg-gradient-to-br from-background to-secondary/20">
      {desktopHeader}
      {mobileHeader}
      <main className="flex-1 py-8">
        <div className="max-w-5xl mx-auto px-4 md:px-8">
          <header className="mb-8">
            <h1 className="text-4xl font-bold text-center">
              Process Tutorial: Step-by-Step Guide
            </h1>
            <p className="mt-4 text-center text-lg text-muted-foreground">
              Explore each step of the process and learn how it works.
            </p>
          </header>

          <section className="mb-8">
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl">Process Overview</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  The process is divided into six distinct stages:
                </p>
                <ol className="list-decimal ml-6 mt-2 space-y-1">
                  {tutorialStages.map((stage) => (
                    <li key={stage.id}>
                      <span className="font-semibold">{stage.name}</span> –{" "}
                      {stage.description.slice(0, 60)}...
                    </li>
                  ))}
                </ol>
                <p className="mt-4">
                  Click on any stage below to view detailed information,
                  including feedback and descriptions for each step.
                </p>
              </CardContent>
            </Card>
          </section>

          <section className="mb-8">
            <h2 className="text-3xl font-semibold mb-4">Process Flow</h2>
            <StageFlow
              stages={tutorialStages}
              loading={false}
              onStageClick={(stage) => setSelectedStage(stage)}
            />
          </section>

          {selectedStage && (
            <section className="max-w-4xl mx-auto mt-10 p-6 border rounded shadow bg-white">
              <h2 className="text-2xl font-bold mb-2">
                {selectedStage.name} Details
              </h2>
              <p className="mb-4 text-muted-foreground">
                <strong>Status:</strong>{" "}
                <span className="font-medium">
                  {selectedStage.status === "approved"
                    ? "Approved"
                    : selectedStage.status === "in-progress"
                    ? "In Progress"
                    : "Pending"}
                </span>
              </p>
              <p className="text-lg">{selectedStage.description}</p>
              {selectedStage.feedback && (
                <div className="mt-4 p-4 bg-gray-50 rounded">
                  <h3 className="font-semibold mb-1">Feedback:</h3>
                  <p>{selectedStage.feedback}</p>
                </div>
              )}
              <Button
                variant="outline"
                size="sm"
                className="mt-6"
                onClick={() => setSelectedStage(null)}
              >
                Close Details
              </Button>
            </section>
          )}
        </div>
      </main>

      <footer className="border-t py-6">
        <div className="w-full px-4 md:px-8 flex flex-col items-center justify-between gap-4 md:flex-row">
          <p className="text-center text-sm text-muted-foreground">
            &copy; {new Date().getFullYear()} Sioux Steel Co. All rights
            reserved.
          </p>
          <p className="text-center text-sm text-muted-foreground">
            Driving innovation across departments
          </p>
        </div>
      </footer>
    </div>
  );
}
