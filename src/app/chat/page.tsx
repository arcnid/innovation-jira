"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import {
  Send,
  FileText,
  Search,
  ChevronRight,
  MessageSquare,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

// Sioux Steel logo component (replace with actual logo SVG)
const SiouxSteelLogo = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="40"
    height="40"
    viewBox="0 0 40 40"
    fill="none"
    className="text-primary"
  >
    <rect width="40" height="40" rx="8" fill="currentColor" />
    <path d="M10 20 L30 20 M20 10 L20 30" stroke="white" strokeWidth="4" />
  </svg>
);

// Desktop header with navigation links
const DesktopHeader = () => (
  <header className="hidden md:flex sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur px-4 md:px-8 h-16 items-center justify-between">
    <Link href="/" className="flex items-center space-x-2">
      <MessageSquare></MessageSquare>
      <span className="inline-block font-bold text-xl">Sioux Steel Co.</span>
    </Link>
    <nav className="flex items-center space-x-4">
      <Link href="/">
        <Button variant="ghost">Home</Button>
      </Link>
      <Link href="/products">
        <Button variant="ghost">Products</Button>
      </Link>
      <Link href="/about">
        <Button variant="ghost">About</Button>
      </Link>
    </nav>
  </header>
);

// Mobile header for smaller viewports
const MobileHeader = () => (
  <header className="md:hidden sticky top-0 z-50 w-full bg-background/95 backdrop-blur px-4 py-2">
    <div className="flex items-center justify-between">
      <Link href="/" className="flex items-center space-x-2">
        <SiouxSteelLogo />
        <span className="text-xl font-bold">Sioux Steel Co.</span>
      </Link>
    </div>
  </header>
);

// Footer component
const Footer = () => (
  <footer className="border-t py-6 mt-8 bg-gray-100">
    <div className="w-full px-4 md:px-8 flex flex-col items-center justify-between gap-4 md:flex-row">
      <p className="text-center text-sm text-muted-foreground">
        &copy; {new Date().getFullYear()} Sioux Steel Co. All rights reserved.
      </p>
      <p className="text-center text-sm text-muted-foreground">
        Innovating steel solutions since 1918
      </p>
    </div>
  </footer>
);

// Mock data for documentation repository
const documentationRepository = [
  {
    id: 1,
    name: "Product Catalog",
    children: [
      { id: 11, name: "Grain Bins" },
      { id: 12, name: "Livestock Equipment" },
      { id: 13, name: "Material Handling" },
    ],
  },
  {
    id: 2,
    name: "Technical Specifications",
    children: [
      { id: 21, name: "Steel Grades" },
      { id: 22, name: "Load Capacities" },
    ],
  },
  {
    id: 3,
    name: "Company Policies",
    children: [
      { id: 31, name: "Quality Assurance" },
      { id: 32, name: "Safety Standards" },
    ],
  },
];

// Documentation Tree component
const DocumentationTree = ({ files }) => (
  <Accordion type="multiple" className="w-full">
    {files.map((file) => (
      <AccordionItem key={file.id} value={`item-${file.id}`}>
        <AccordionTrigger className="text-sm">
          <span className="flex items-center">
            <FileText className="h-4 w-4 mr-2" />
            {file.name}
          </span>
        </AccordionTrigger>
        <AccordionContent>
          <ul className="pl-4">
            {file.children.map((child) => (
              <li key={child.id} className="py-1">
                <button className="text-sm flex items-center hover:text-primary">
                  <ChevronRight className="h-3 w-3 mr-1" />
                  {child.name}
                </button>
              </li>
            ))}
          </ul>
        </AccordionContent>
      </AccordionItem>
    ))}
  </Accordion>
);

// Chat Message component
const ChatMessage = ({ message, isUser }) => (
  <div className={`flex ${isUser ? "justify-end" : "justify-start"} mb-4`}>
    <div
      className={`max-w-[70%] p-3 rounded-lg ${
        isUser ? "bg-primary text-primary-foreground" : "bg-muted"
      }`}
    >
      {message}
    </div>
  </div>
);

// Main AI Chat Page component
export default function AIChatPage() {
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState("");
  const chatEndRef = useRef(null);

  const handleSendMessage = () => {
    if (inputMessage.trim() !== "") {
      setMessages([...messages, { text: inputMessage, isUser: true }]);
      setInputMessage("");
      // Here you would typically send the message to your backend/LLM
      // and then add the response to the messages
      setTimeout(() => {
        setMessages((prev) => [
          ...prev,
          {
            text: "Based on our product catalog, I can provide information about our grain bins, livestock equipment, and material handling solutions. Which specific product line are you interested in?",
            isUser: false,
          },
        ]);
      }, 1000);
    }
  };

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]); //Corrected dependency

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <DesktopHeader />
      <MobileHeader />

      <main className="flex-1 py-4 md:py-8 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4 md:px-8">
          <h1 className="text-3xl font-bold text-center mb-8">
            Sioux Steel Knowledge Assistant
          </h1>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
            {/* Left side - Documentation Repository */}
            <Card className="lg:col-span-1">
              <CardHeader>
                <CardTitle className="text-xl flex items-center gap-2">
                  <Search className="h-5 w-5" />
                  Documentation
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="mb-4">
                  <Input
                    type="search"
                    placeholder="Search documentation..."
                    className="w-full"
                  />
                </div>
                <ScrollArea className="h-[calc(100vh-300px)]">
                  <DocumentationTree files={documentationRepository} />
                </ScrollArea>
              </CardContent>
            </Card>

            {/* Right side - Chat Interface */}
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle className="text-xl flex items-center gap-2">
                  <MessageSquare className="h-6 w-6 text-primary" />
                  Sioux Steel Chat Assistant
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-[calc(100vh-300px)] mb-4">
                  {messages.length === 0 ? (
                    <div className="text-center text-muted-foreground py-8">
                      <p className="max-w-md mx-auto">
                        Welcome to the Sioux Steel Knowledge Assistant. How can
                        I help you today?
                      </p>
                    </div>
                  ) : (
                    messages.map((msg, index) => (
                      <ChatMessage
                        key={index}
                        message={msg.text}
                        isUser={msg.isUser}
                      />
                    ))
                  )}
                  <div ref={chatEndRef} />
                </ScrollArea>
                <div className="flex items-center space-x-2">
                  <Input
                    type="text"
                    placeholder="Ask about Sioux Steel products or policies..."
                    value={inputMessage}
                    onChange={(e) => setInputMessage(e.target.value)}
                    onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
                    className="flex-grow"
                  />
                  <Button onClick={handleSendMessage} className="flex-shrink-0">
                    <Send className="h-4 w-4 mr-2" />
                    Send
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
