"use client";

import React from "react";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import {
  CheckCircle,
  XCircle,
  Clock,
  Lightbulb,
  BarChart,
  FileText,
  FileCode,
  Book,
  Rocket,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Badge } from "@/components/ui/badge";

// Component to render the icon for a stage based on its index and status.
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

// Component to render the status icon.
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

const StageFlow = ({ stages, loading }) => {
  return (
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
        : stages.map((stage, index) => (
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
                {index < stages.length - 1 && (
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
                      <p>{stage.feedback || "No feedback available yet."}</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
                {stage.status === "in-progress" && (
                  <Button variant="outline" size="sm" className="mt-2">
                    Provide Input
                  </Button>
                )}
              </div>
            </div>
          ))}
    </div>
  );
};

export default StageFlow;
