"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Lightbulb,
  Code,
  HelpCircle,
  Search,
  ExternalLink,
  BookOpen,
} from "lucide-react";
import { useRouter } from "next/navigation";

export default function WikiPortal() {
  const router = useRouter();

  // Desktop Header (kept exactly as before)
  const desktopHeader = (
    <header className="hidden md:flex sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="w-full px-4 md:px-8 flex h-16 items-center justify-between">
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
      </div>
    </header>
  );

  // Mobile Header (new mobile friendly layout)
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

  // Choose header based on viewport.
  const header = (
    <>
      {desktopHeader}
      {mobileHeader}
    </>
  );

  return (
    <div className="flex min-h-screen flex-col relative">
      {/* Header */}
      {header}

      {/* Main Content */}
      <main className="flex-1 max-w-7xl mx-auto">
        {/* Welcome Section */}
        <section className="w-full px-4 md:px-8 py-8">
          <div className="text-left">
            <h1 className="text-3xl font-extrabold leading-tight tracking-tighter md:text-4xl">
              Welcome to the Sioux Steel Technical Division
            </h1>
            <p className="mt-2 text-xl text-primary font-medium">
              The Sioux Steel hub for project activity &amp; technical
              innovation 🚀
            </p>
            <p className="mt-4 text-lg text-muted-foreground">
              Got an innovative idea? Use our streamlined New Product
              Introduction process to submit your proposal directly to the
              Innovation team.
            </p>
          </div>
        </section>

        {/* Content Sections */}
        <section className="w-full px-4 md:px-8 pb-10">
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
            <div className="lg:col-span-1 font-semibold">
              <Card className="h-full shadow-lg">
                <CardHeader>
                  <CardTitle>Table of Contents</CardTitle>
                  <CardDescription>
                    Jump straight to the section you need
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ScrollArea className="h-[calc(100vh-350px)]">
                    <div className="space-y-4">
                      <div>
                        <h3 className="mb-2 text-lg font-medium">
                          Departments
                        </h3>
                        <ul className="space-y-4 text-lg">
                          <li>
                            <Button
                              asChild
                              variant="secondary"
                              className="w-full justify-start"
                            >
                              <Link
                                href="https://siouxsteel.atlassian.net/wiki/spaces/INNOVATION/overview"
                                className="flex items-center hover:underline"
                              >
                                <Lightbulb className="mr-2 h-5 w-5" />
                                Innovation R&amp;D
                              </Link>
                            </Button>
                          </li>
                          <li>
                            <Button
                              asChild
                              variant="secondary"
                              className="w-full justify-start"
                            >
                              <Link
                                href="https://siouxsteel.atlassian.net/wiki/spaces/Engineerin/overview"
                                className="flex items-center hover:underline"
                              >
                                <Code className="mr-2 h-5 w-5" />
                                Engineering
                              </Link>
                            </Button>
                          </li>
                          <li>
                            <Button
                              asChild
                              variant="secondary"
                              className="w-full justify-start"
                            >
                              <Link
                                href="https://siouxsteel.atlassian.net/wiki/spaces/SS/overview"
                                className="flex items-center hover:underline"
                              >
                                <HelpCircle className="mr-2 h-5 w-5" />
                                IT &amp; Helpdesk
                              </Link>
                            </Button>
                          </li>
                        </ul>
                      </div>

                      <div>
                        <h3 className="mb-2 text-lg font-medium">
                          Quick Links
                        </h3>
                        <ul className="space-y-4 text-lg">
                          <li>
                            <Button
                              asChild
                              variant="secondary"
                              className="w-full justify-start"
                            >
                              <Link
                                href="/projects"
                                className="flex items-center hover:underline"
                              >
                                Current R&amp;D Projects
                              </Link>
                            </Button>
                          </li>
                          <li>
                            <Button
                              asChild
                              variant="secondary"
                              className="w-full justify-start"
                            >
                              <Link
                                href="/create"
                                className="flex items-center hover:underline"
                              >
                                Submit an Idea 📝
                              </Link>
                            </Button>
                          </li>
                          <li>
                            <Button
                              asChild
                              variant="secondary"
                              className="w-full justify-start"
                            >
                              <Link
                                href="/ideas"
                                className="flex items-center hover:underline"
                              >
                                Current Idea Pipeline 🚀
                              </Link>
                            </Button>
                          </li>
                          <li>
                            <Button
                              asChild
                              variant="secondary"
                              className="w-full justify-start"
                            >
                              <Link
                                href="/process"
                                className="flex items-center hover:underline"
                              >
                                NPI Process Tutorial 🎓
                              </Link>
                            </Button>
                          </li>
                        </ul>
                      </div>
                    </div>
                  </ScrollArea>
                </CardContent>
              </Card>
            </div>

            {/* Departments & Insights Tabs */}
            <div className="lg:col-span-2">
              <Tabs defaultValue="departments" className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="departments">Departments</TabsTrigger>
                  <TabsTrigger value="insights">Submit an Idea</TabsTrigger>
                </TabsList>
                <TabsContent value="departments" className="space-y-8">
                  {/* Innovation R&D */}
                  <section id="innovation" className="scroll-mt-16">
                    <Card className="shadow-lg">
                      <CardHeader className="bg-primary/5">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            <Lightbulb className="h-5 w-5 text-primary" />
                            <CardTitle>Innovation R&amp;D</CardTitle>
                          </div>
                          <Badge variant="outline">Featured</Badge>
                        </div>
                        <CardDescription>
                          Leading the charge in groundbreaking product research
                          and development.
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="pt-6">
                        <p className="text-sm text-muted-foreground">
                          Our Innovation R&amp;D team pioneers emerging
                          technologies and develops future-forward products.
                          Collaborating with multiple departments, they
                          transform creative ideas into tangible solutions.
                        </p>
                      </CardContent>
                      <CardFooter className="border-t bg-muted/50 px-6 py-3">
                        <Link
                          href="https://siouxsteel.atlassian.net/wiki/spaces/INNOVATION/overview"
                          className="flex items-center text-sm text-primary hover:underline"
                          target="_blank"
                        >
                          Visit Innovation R&amp;D Confluence{" "}
                          <ExternalLink className="ml-1 h-3 w-3" />
                        </Link>
                      </CardFooter>
                    </Card>
                  </section>

                  {/* Engineering */}
                  <section id="engineering" className="scroll-mt-16">
                    <Card className="shadow-lg">
                      <CardHeader>
                        <div className="flex items-center space-x-2">
                          <Code className="h-5 w-5 text-primary" />
                          <CardTitle>Engineering</CardTitle>
                        </div>
                        <CardDescription>
                          Crafting robust solutions and maintaining core
                          systems.
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="pt-6">
                        <p className="text-sm text-muted-foreground">
                          The Engineering department is dedicated to building
                          and refining our products and services. Our engineers
                          and project managers work in tandem to ensure high
                          standards and seamless performance across all
                          operations.
                        </p>
                      </CardContent>
                      <CardFooter className="border-t bg-muted/50 px-6 py-3">
                        <Link
                          href="https://siouxsteel.atlassian.net/wiki/spaces/Engineerin/overview"
                          className="flex items-center text-sm text-primary hover:underline"
                          target="_blank"
                        >
                          Visit Engineering Confluence{" "}
                          <ExternalLink className="ml-1 h-3 w-3" />
                        </Link>
                      </CardFooter>
                    </Card>
                  </section>

                  {/* IT & Helpdesk */}
                  <section id="it" className="scroll-mt-16">
                    <Card className="shadow-lg">
                      <CardHeader>
                        <div className="flex items-center space-x-2">
                          <HelpCircle className="h-5 w-5 text-primary" />
                          <CardTitle>
                            Information Technology &amp; Helpdesk
                          </CardTitle>
                        </div>
                        <CardDescription>
                          Ensuring a seamless technical experience.
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="pt-6">
                        <p className="text-sm text-muted-foreground">
                          Our IT &amp; Helpdesk team is committed to maintaining
                          a reliable technical infrastructure. They provide
                          expert support for hardware, software, and network
                          issues to keep our operations running smoothly.
                        </p>
                      </CardContent>
                      <CardFooter className="border-t bg-muted/50 px-6 py-3">
                        <Link
                          href="https://siouxsteel.atlassian.net/wiki/spaces/SS/overview"
                          className="flex items-center text-sm text-primary hover:underline"
                          target="_blank"
                        >
                          Visit IT &amp; Helpdesk Confluence{" "}
                          <ExternalLink className="ml-1 h-3 w-3" />
                        </Link>
                      </CardFooter>
                    </Card>
                  </section>
                </TabsContent>

                {/* Insights & Resources */}
                <TabsContent value="insights" className="space-y-8">
                  {/* Submit an Idea Banner */}
                  <section id="submit-idea" className="scroll-mt-16">
                    <Card className="shadow-lg bg-primary/10 border-l-4 border-primary">
                      <CardHeader>
                        <div className="flex items-center space-x-2">
                          <Lightbulb className="h-6 w-6 text-primary" />
                          <CardTitle>Submit an Idea</CardTitle>
                        </div>
                        <CardDescription>
                          Have a visionary concept? Share it with our Innovation
                          team to help shape the future.
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          <p className="text-sm text-muted-foreground">
                            We invite every team member to propose ideas that
                            can revolutionize our products, services, or
                            processes. Your idea might be the next breakthrough
                            for our Sioux Steel.
                          </p>
                          <div className="rounded-lg bg-primary/5 p-4">
                            <h4 className="font-medium">How It Works:</h4>
                            <ol className="mt-2 space-y-2 text-sm text-muted-foreground">
                              <li>
                                1. Submit your idea using the Confluence form.
                              </li>
                              <li>
                                2. The Innovation team carefully reviews each
                                submission.
                              </li>
                              <li>3. Promising ideas are discussed further.</li>
                              <li>
                                4. Approved ideas move forward in our innovation
                                pipeline.
                              </li>
                            </ol>
                          </div>
                        </div>
                      </CardContent>
                      <CardFooter className="flex justify-between border-t px-6 py-4">
                        <p className="text-sm text-muted-foreground">
                          Review period: All submissions are processed within 2
                          weeks.
                        </p>
                        <Button onClick={() => router.push("/create")}>
                          <span className="flex items-center">
                            Submit Your Idea{" "}
                            <ExternalLink className="ml-2 h-4 w-4" />
                          </span>
                        </Button>
                      </CardFooter>
                    </Card>
                  </section>
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t py-6">
        <div className="w-full px-4 md:px-8 flex flex-col items-center justify-between gap-4 md:h-16 md:flex-row">
          <p className="text-center text-sm leading-loose text-muted-foreground">
            &copy; {new Date().getFullYear()} Sioux Steel Co. All rights
            reserved.
          </p>
          <p className="text-center text-sm leading-loose text-muted-foreground">
            Last updated: {new Date().toLocaleDateString()}
          </p>
        </div>
      </footer>
    </div>
  );
}
