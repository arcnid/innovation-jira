"use client";
import { useState, useRef, useEffect } from "react";
import React from "react";

import Link from "next/link";
import {
  BookOpen,
  ChevronLeft,
  ChevronRight,
  Lightbulb,
  BarChart,
  FileText,
  FileCode,
  Book,
  Rocket,
  CheckCircle,
  XCircle,
  Clock,
  Info,
  HelpCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

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
  const [activeStep, setActiveStep] = useState(0);
  const [showTip, setShowTip] = useState(true);
  const [completedSteps, setCompletedSteps] = useState([]);
  const [highlightedSection, setHighlightedSection] = useState(null);
  const stageRefs = useRef([]);

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
      details: [
        "Conduct market research to identify opportunities",
        "Brainstorm potential solutions with cross-functional teams",
        "Evaluate ideas based on feasibility, market potential, and alignment with company goals",
        "Select the most promising concept for further development",
      ],
      keyPoints: [
        "Involves stakeholders from multiple departments",
        "Uses SWOT analysis to evaluate concepts",
        "Requires executive sponsor approval to proceed",
      ],
      documents: ["New Product Concept"],
    },
    {
      id: 2,
      name: "New Product Business Impact Analysis",
      status: "approved",
      completedDate: "2023-02-05",
      feedback: "Impact analysis complete.",
      description:
        "In this phase, the potential impact of the concept on business operations is assessed. Financial and operational risks are identified.",
      details: [
        "Analyze financial implications including investment required and potential ROI",
        "Identify operational impacts on existing processes and resources",
        "Assess market risks and competitive landscape",
        "Develop mitigation strategies for identified risks",
      ],
      keyPoints: [
        "Financial analysis must be approved by Finance department",
        "Risk assessment matrix is used to quantify potential issues",
        "Go/No-Go decision point occurs at the end of this stage",
      ],
      documents: ["Business Analysis / Plan", "Market Analysis & Forecast"],
    },
    {
      id: 3,
      name: "New Product Project Formulation",
      status: "in-progress",
      completedDate: null,
      feedback: "Formulation underway.",
      description:
        "Detailed project planning takes place in this stage, where scope, resources, and timelines are defined.",
      details: [
        "Define project scope, objectives, and deliverables",
        "Identify required resources and team members",
        "Create detailed project timeline with milestones",
        "Establish budget and resource allocation plan",
      ],
      keyPoints: [
        "Uses Gantt charts for timeline visualization",
        "RACI matrix defines roles and responsibilities",
        "Project charter must be signed by all stakeholders",
      ],
      documents: ["Project Charter", "Project Timeline"],
    },
    {
      id: 4,
      name: "New Product Prototyping/Execution",
      status: "pending",
      completedDate: null,
      feedback: "",
      description:
        "Prototyping phase involves building and testing the product. Iterative development and refinement are key aspects.",
      details: [
        "Develop initial prototype based on specifications",
        "Conduct internal testing and gather feedback",
        "Refine prototype through iterative development",
        "Prepare for user acceptance testing",
      ],
      keyPoints: [
        "Multiple prototype iterations may be required",
        "Testing protocols must be documented and followed",
        "Engineering and design teams collaborate closely",
      ],
      documents: [
        "Prototype Specifications",
        "Test Plans and Results",
        "Design Modification Log",
        "User Feedback Reports",
      ],
    },
    {
      id: 5,
      name: "New Product Pre-Production",
      status: "pending",
      completedDate: null,
      feedback: "",
      description:
        "The product is prepped for manufacturing. Final adjustments and quality assurance tests are conducted.",
      details: [
        "Finalize product specifications for manufacturing",
        "Develop quality control procedures",
        "Create production documentation and training materials",
        "Conduct pre-production run to validate processes",
      ],
      keyPoints: [
        "Quality assurance sign-off required",
        "Manufacturing team must be trained on new processes",
        "Supply chain for components must be established",
      ],
      documents: [
        "Specifications Package",
        "Marketing Plan",
        "Manufacturing Instructions",
        "Quality Assurance Plan",
        "Support and Training Materials",
        "New Product Acceptance Form",
      ],
    },
    {
      id: 6,
      name: "New Product Close-Out/Release",
      status: "pending",
      completedDate: null,
      feedback: "",
      description:
        "Finalization of the project and official product release. Post-launch reviews and documentation are completed.",
      details: [
        "Finalize all documentation and project deliverables",
        "Conduct post-project review and lessons learned session",
        "Transfer ownership to operations team",
        "Celebrate project completion and recognize team contributions",
      ],
      keyPoints: [
        "Post-launch monitoring plan must be established",
        "Lessons learned document is required for future projects",
        "Final report presented to executive team",
      ],
      documents: ["New Product Release Form"],
    },
  ];

  // Initialize refs array when component mounts
  useEffect(() => {
    stageRefs.current = Array(tutorialStages.length)
      .fill()
      .map((_, i) => stageRefs.current[i] || React.createRef());
  }, []);

  // Scroll to the selected stage
  useEffect(() => {
    if (
      selectedStage !== null &&
      stageRefs.current[selectedStage.id - 1]?.current
    ) {
      stageRefs.current[selectedStage.id - 1].current.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
    }
  }, [selectedStage]);

  // Function to handle completing a step in the tutorial
  const completeStep = (stepId) => {
    if (!completedSteps.includes(stepId)) {
      setCompletedSteps([...completedSteps, stepId]);
    }
  };

  // Function to navigate between steps
  const navigateStep = (direction) => {
    const newStep =
      direction === "next"
        ? Math.min(activeStep + 1, tutorialStages.length - 1)
        : Math.max(activeStep - 1, 0);

    setActiveStep(newStep);
    setSelectedStage(tutorialStages[newStep]);
    setHighlightedSection(null);
  };

  // Function to highlight a specific section
  const highlightSection = (section) => {
    setHighlightedSection(section);
    // Auto-complete the current step when a user interacts with it
    if (selectedStage) {
      completeStep(selectedStage.id);
    }
  };

  // Calculate progress percentage
  const progressPercentage =
    (completedSteps.length / tutorialStages.length) * 100;

  return (
    <div className="flex min-h-screen flex-col bg-gradient-to-br from-background to-secondary/20">
      {desktopHeader}
      {mobileHeader}
      <main className="flex-1 py-4 md:py-8">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <header className="mb-6">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between">
              <div>
                <h1 className="text-3xl md:text-4xl font-bold">
                  New Product Introduction Process: Interactive Reference Guide
                </h1>
                <p className="mt-2 text-muted-foreground">
                  Learn each step of the process through this interactive
                  tutorial
                </p>
              </div>
              <div className="mt-4 md:mt-0 flex items-center gap-2">
                <span className="text-sm text-muted-foreground">Progress:</span>
                <div className="w-40 md:w-48">
                  <Progress value={progressPercentage} className="h-2" />
                </div>
                <span className="text-sm font-medium">
                  {Math.round(progressPercentage)}%
                </span>
              </div>
            </div>
          </header>

          {showTip && (
            <div className="mb-6 bg-blue-50 border border-blue-200 rounded-lg p-4 relative">
              <div className="flex items-start gap-3">
                <HelpCircle className="h-5 w-5 text-blue-500 mt-0.5 flex-shrink-0" />
                <div>
                  <h3 className="font-medium text-blue-800">
                    How to use this tutorial
                  </h3>
                  <p className="text-blue-700 text-sm mt-1">
                    Click on any stage in the process flow on the left to see
                    detailed information on the right. You can navigate through
                    the stages using the arrows below or by directly clicking on
                    a stage.
                  </p>
                </div>
              </div>
              <button
                className="absolute top-2 right-2 text-blue-400 hover:text-blue-600"
                onClick={() => setShowTip(false)}
              >
                <XCircle className="h-5 w-5" />
              </button>
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
            {/* Left side - Visual Process Flow */}
            <div className="order-2 lg:order-1">
              <Card className="h-full">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="h-5 w-5" />
                    Process Flow Visualization
                  </CardTitle>
                  <CardDescription>
                    Click on any stage to view detailed information
                  </CardDescription>
                </CardHeader>
                <CardContent className="overflow-auto max-h-[calc(100vh-300px)]">
                  <div className="relative pb-4">
                    {tutorialStages.map((stage, index) => (
                      <div
                        key={index}
                        ref={stageRefs.current[index]}
                        className={`flex items-start mb-8 transition-all duration-300 ${
                          selectedStage?.id === stage.id
                            ? "scale-[1.02] bg-primary/5 rounded-lg border-l-4 border-l-primary border border-primary/10 px-3 py-2"
                            : "px-3"
                        }`}
                        onClick={() => {
                          setSelectedStage(stage);
                          setActiveStep(index);
                        }}
                      >
                        <div className="mr-4 relative">
                          <div
                            className={`w-12 h-12 rounded-full flex items-center justify-center cursor-pointer transition-colors ${
                              selectedStage?.id === stage.id
                                ? "ring-2 ring-primary ring-offset-2"
                                : ""
                            } ${
                              stage.status === "approved"
                                ? "bg-green-100"
                                : stage.status === "in-progress"
                                ? "bg-blue-100"
                                : completedSteps.includes(stage.id)
                                ? "bg-amber-100"
                                : "bg-gray-100"
                            }`}
                          >
                            <StageIcon stage={stage} index={index} />
                          </div>
                          {index < tutorialStages.length - 1 && (
                            <div className="absolute top-12 left-1/2 -translate-x-1/2 flex flex-col items-center">
                              <div
                                className={`w-0.5 h-4 ${
                                  selectedStage?.id === stage.id ||
                                  selectedStage?.id === stage.id + 1
                                    ? "bg-primary"
                                    : "bg-gray-300"
                                }`}
                              />
                              {(selectedStage?.id === stage.id ||
                                selectedStage?.id === stage.id + 1) && (
                                <div className="w-3 h-3 rounded-full bg-primary my-1" />
                              )}
                              <div
                                className={`w-0.5 h-9 ${
                                  selectedStage?.id === stage.id + 1
                                    ? "bg-primary"
                                    : "bg-gray-300"
                                }`}
                              />
                            </div>
                          )}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-start justify-between">
                            <h3 className="font-medium text-base">
                              {stage.name}
                            </h3>
                            <StageStatusBadge
                              status={stage.status}
                              completed={completedSteps.includes(stage.id)}
                            />
                          </div>
                          <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                            {stage.description}
                          </p>
                          {stage.completedDate && (
                            <p className="text-xs text-muted-foreground mt-2">
                              Completed: {stage.completedDate}
                            </p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Right side - Context and Details */}
            <div className="order-1 lg:order-2">
              <Card className="h-full">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle>
                      {selectedStage ? selectedStage.name : "Select a Stage"}
                    </CardTitle>
                    {selectedStage && (
                      <StageStatusBadge
                        status={selectedStage.status}
                        completed={completedSteps.includes(selectedStage?.id)}
                      />
                    )}
                  </div>
                  {selectedStage && (
                    <CardDescription>
                      {selectedStage.description}
                    </CardDescription>
                  )}
                </CardHeader>
                <CardContent className="overflow-auto max-h-[calc(100vh-350px)]">
                  {!selectedStage ? (
                    <div className="flex flex-col items-center justify-center py-12 text-center">
                      <Info className="h-12 w-12 text-muted-foreground mb-4" />
                      <h3 className="text-lg font-medium mb-2">
                        No Stage Selected
                      </h3>
                      <p className="text-muted-foreground max-w-md">
                        Click on any stage in the process flow on the left to
                        view detailed information here.
                      </p>
                    </div>
                  ) : (
                    <Tabs defaultValue="details" className="w-full">
                      <TabsList className="grid grid-cols-3 mb-4">
                        <TabsTrigger
                          value="details"
                          onClick={() => highlightSection("details")}
                          className={
                            highlightedSection === "details"
                              ? "ring-2 ring-primary ring-offset-2"
                              : ""
                          }
                        >
                          Details
                        </TabsTrigger>
                        <TabsTrigger
                          value="keyPoints"
                          onClick={() => highlightSection("keyPoints")}
                          className={
                            highlightedSection === "keyPoints"
                              ? "ring-2 ring-primary ring-offset-2"
                              : ""
                          }
                        >
                          Key Points
                        </TabsTrigger>
                        <TabsTrigger
                          value="documents"
                          onClick={() => highlightSection("documents")}
                          className={
                            highlightedSection === "documents"
                              ? "ring-2 ring-primary ring-offset-2"
                              : ""
                          }
                        >
                          Documents
                        </TabsTrigger>
                      </TabsList>

                      <TabsContent value="details" className="space-y-4">
                        <div className="space-y-4">
                          <h3 className="text-lg font-medium">Process Steps</h3>
                          <ul className="space-y-2">
                            {selectedStage.details.map((detail, idx) => (
                              <li key={idx} className="flex items-start gap-2">
                                <div className="h-5 w-5 rounded-full bg-primary/10 text-primary flex items-center justify-center flex-shrink-0 mt-0.5">
                                  {idx + 1}
                                </div>
                                <span>{detail}</span>
                              </li>
                            ))}
                          </ul>
                        </div>

                        {selectedStage.feedback && (
                          <div className="mt-6 p-4 bg-gray-50 rounded-lg border border-gray-100">
                            <h3 className="font-medium mb-2 flex items-center gap-2">
                              <MessageIcon />
                              Feedback
                            </h3>
                            <p className="text-muted-foreground">
                              {selectedStage.feedback}
                            </p>
                          </div>
                        )}
                      </TabsContent>

                      <TabsContent value="keyPoints">
                        <div className="space-y-4">
                          <h3 className="text-lg font-medium">
                            Important Considerations
                          </h3>
                          <ul className="space-y-3">
                            {selectedStage.keyPoints.map((point, idx) => (
                              <li
                                key={idx}
                                className="flex items-start gap-2 p-2 bg-amber-50 rounded-md"
                              >
                                <Lightbulb className="h-5 w-5 text-amber-500 flex-shrink-0 mt-0.5" />
                                <span>{point}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </TabsContent>

                      <TabsContent value="documents">
                        <div className="space-y-4">
                          <h3 className="text-lg font-medium">
                            Required Documentation
                          </h3>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            {selectedStage.documents.map((doc, idx) => (
                              <div
                                key={idx}
                                className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg border border-gray-200"
                              >
                                <FileText className="h-5 w-5 text-blue-500" />
                                <span className="font-medium text-sm">
                                  {doc}
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </TabsContent>
                    </Tabs>
                  )}
                </CardContent>
                <CardFooter className="flex justify-between border-t pt-4">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => navigateStep("prev")}
                    disabled={activeStep === 0}
                  >
                    <ChevronLeft className="mr-1 h-4 w-4" /> Previous Stage
                  </Button>

                  <Button
                    variant="default"
                    size="sm"
                    onClick={() => {
                      if (selectedStage) {
                        completeStep(selectedStage.id);
                      }
                      navigateStep("next");
                    }}
                    disabled={activeStep === tutorialStages.length - 1}
                  >
                    Next Stage <ChevronRight className="ml-1 h-4 w-4" />
                  </Button>
                </CardFooter>
              </Card>
            </div>
          </div>
        </div>
      </main>

      <footer className="border-t py-6 mt-8">
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

// Component to render the icon for a stage based on its index and status.
const StageIcon = ({ stage, index }) => {
  const icons = [Lightbulb, BarChart, FileText, FileCode, Book, Rocket];
  const Icon = icons[index % icons.length];
  return (
    <Icon
      className={`h-6 w-6 ${
        stage.status === "approved"
          ? "text-green-600"
          : stage.status === "in-progress"
          ? "text-blue-600"
          : "text-gray-400"
      }`}
    />
  );
};

// Component to render the status badge
const StageStatusBadge = ({ status, completed }) => {
  if (completed && status !== "approved") {
    return (
      <Badge
        variant="outline"
        className="bg-amber-100 text-amber-800 border-amber-200"
      >
        <CheckCircle className="h-3 w-3 mr-1" /> Completed
      </Badge>
    );
  }

  switch (status) {
    case "approved":
      return (
        <Badge
          variant="outline"
          className="bg-green-100 text-green-800 border-green-200"
        >
          <CheckCircle className="h-3 w-3 mr-1" /> Approved
        </Badge>
      );
    case "in-progress":
      return (
        <Badge
          variant="outline"
          className="bg-blue-100 text-blue-800 border-blue-200"
        >
          <Clock className="h-3 w-3 mr-1" /> In Progress
        </Badge>
      );
    default:
      return (
        <Badge
          variant="outline"
          className="bg-gray-100 text-gray-800 border-gray-200"
        >
          <Clock className="h-3 w-3 mr-1" /> Pending
        </Badge>
      );
  }
};

// Message icon component
const MessageIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="text-blue-500"
  >
    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
  </svg>
);
