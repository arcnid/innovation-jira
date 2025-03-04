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
	return (
		<div className="flex min-h-screen flex-col relative">
			{/* Header remains exactly as is */}
			<header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
				<div className="w-full px-4 md:px-8 flex h-16 items-center justify-between">
					<Link href="/" className="flex items-center space-x-2">
						<BookOpen className="h-6 w-6" />
						<span className="font-bold">Sioux Steel Wiki</span>
					</Link>
					<div className="flex flex-1 items-center justify-end">
						<div className="relative w-full max-w-[300px]">
							<Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
							<input
								type="search"
								placeholder="Search wiki..."
								className="w-full rounded-md border border-input bg-background px-3 py-2 pl-8 text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
							/>
						</div>
					</div>
				</div>
			</header>

			{/* Main Content Container - slightly wider */}
			<main className="flex-1 max-w-7xl mx-auto">
				{/* Welcome Section */}
				<section className="w-full px-4 md:px-8 py-8">
					<div className="text-left">
						<h1 className="text-3xl font-extrabold leading-tight tracking-tighter md:text-4xl">
							Welcome to the Sioux Steel Technical Division
						</h1>
						<p className="mt-4 text-lg text-muted-foreground">
							Your central hub for department information, project insights, and
							company resources.
						</p>
					</div>
				</section>

				{/* Content Sections */}
				<section className="w-full px-4 md:px-8 pb-10">
					<div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
						{/* Table of Contents */}
						<div className="lg:col-span-1 font-semibold">
							<Card className="h-full shadow-lg">
								<CardHeader>
									<CardTitle>Table of Contents</CardTitle>
									<CardDescription>
										Quick navigation to all sections
									</CardDescription>
								</CardHeader>
								<CardContent>
									{/* Reduced scroll area height to make left nav less tall */}
									<ScrollArea className="h-[calc(100vh-400px)]">
										<div className="space-y-4">
											<div>
												<h3 className="mb-2 text-lg font-medium">
													Departments
												</h3>
												<ul className="space-y-4 text-lg">
													<li>
														<Link
															href="#innovation"
															className="flex items-center text-muted-foreground hover:text-primary"
														>
															<Lightbulb className="mr-2 h-5 w-5" />
															Innovation R&amp;D 💡
														</Link>
													</li>
													<li>
														<Link
															href="#engineering"
															className="flex items-center text-muted-foreground hover:text-primary"
														>
															<Code className="mr-2 h-5 w-5" />
															Engineering 💻
														</Link>
													</li>
													<li>
														<Link
															href="#it"
															className="flex items-center text-muted-foreground hover:text-primary"
														>
															<HelpCircle className="mr-2 h-5 w-5" />
															IT &amp; Helpdesk 🔧
														</Link>
													</li>
												</ul>
											</div>
											<div>
												<h3 className="mb-2 text-lg font-medium">
													Special Sections
												</h3>
												<ul className="space-y-4 text-lg">
													<li>
														<Link
															href="/projects"
															className="flex items-center text-muted-foreground hover:text-primary"
														>
															Current R&amp;D Projects 🚀
														</Link>
													</li>
													<li>
														<Link
															href="#submit-idea"
															className="flex items-center text-muted-foreground hover:text-primary"
														>
															Submit an Idea 📝
														</Link>
													</li>
												</ul>
											</div>
										</div>
									</ScrollArea>
								</CardContent>
								{/* Banner with Submit Button */}
								
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
													Driving future product development and technological
													advancement
												</CardDescription>
											</CardHeader>
											<CardContent className="pt-6">
												<p className="text-sm text-muted-foreground">
													The Innovation R&amp;D department focuses on
													researching and developing new technologies, products,
													and solutions that will shape our company&apos;s
													future. The team works on cutting-edge projects and
													collaborates with other departments to bring
													innovative ideas to life.
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
													Building and maintaining our core products and
													services
												</CardDescription>
											</CardHeader>
											<CardContent className="pt-6">
												<p className="text-sm text-muted-foreground">
													The Engineering department is responsible for the
													development, implementation, and maintenance of our
													company&apos;s products and services. The team
													consists of structural engineers, mechanical
													engineers, and project managers who work together to
													deliver high-quality solutions.
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
													Supporting our technical infrastructure and providing
													assistance
												</CardDescription>
											</CardHeader>
											<CardContent className="pt-6">
												<p className="text-sm text-muted-foreground">
													The IT &amp; Helpdesk department ensures that our
													company&apos;s technical infrastructure runs smoothly
													and efficiently. They provide support for hardware,
													software, and network issues, and help employees
													resolve technical problems quickly.
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
													Have a great idea for a new product, feature, or
													improvement? Share it with our Innovation team!
												</CardDescription>
											</CardHeader>
											<CardContent>
												<div className="space-y-4">
													<p className="text-sm text-muted-foreground">
														We encourage all employees to contribute ideas that
														could help improve our products, services, or
														internal processes. Your idea could be the next big
														innovation for our company!
													</p>
													<div className="rounded-lg bg-primary/5 p-4">
														<h4 className="font-medium">How it works:</h4>
														<ol className="mt-2 space-y-2 text-sm text-muted-foreground">
															<li>
																1. Submit your idea using the Confluence form
															</li>
															<li>
																2. The Innovation team reviews all submissions
															</li>
															<li>
																3. If selected, you'll be invited to discuss
																your idea further
															</li>
															<li>
																4. Approved ideas move into our innovation
																pipeline
															</li>
														</ol>
													</div>
												</div>
											</CardContent>
											<CardFooter className="flex justify-between border-t px-6 py-4">
												<p className="text-sm text-muted-foreground">
													All submissions are reviewed within 2 weeks
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

			{/* Floating Submit Button (always visible) */}
			<div className="fixed bottom-4 right-4 z-50">
				<Button
					onClick={() => router.push("/create")}
					variant="secondary"
					className="shadow-lg"
				>
					Submit New Idea
				</Button>
			</div>
		</div>
	);
}
