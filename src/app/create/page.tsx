"use client";

import type React from "react";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import {
	BookOpen,
	ChevronLeft,
	Upload,
	Lightbulb,
	Target,
	TrendingUp,
	DollarSign,
	Clock,
	CheckCircle2,
	AlertCircle,
	Sparkles,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import {
	Form,
	FormControl,
	FormDescription,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
// Import Sonner's toast and Toaster instead of the custom ones
import { toast, Toaster } from "sonner";

const formSchema = z.object({
	title: z
		.string()
		.min(5, {
			message: "Title must be at least 5 characters.",
		})
		.max(100, {
			message: "Title must not exceed 100 characters.",
		}),
	summary: z
		.string()
		.min(20, {
			message: "Summary must be at least 20 characters.",
		})
		.max(500, {
			message: "Summary must not exceed 500 characters.",
		}),
	description: z
		.string()
		.min(100, {
			message: "Description must be at least 100 characters.",
		})
		.max(2000, {
			message: "Description must not exceed 2000 characters.",
		}),
	category: z.string({
		required_error: "Please select a category.",
	}),
	department: z.string({
		required_error: "Please select a department.",
	}),
	impact: z.string({
		required_error: "Please select the potential impact.",
	}),
	timeframe: z.string({
		required_error: "Please select an estimated timeframe.",
	}),
	resources: z.string().min(20, {
		message: "Resource description must be at least 20 characters.",
	}),
	budget: z.string().min(1, {
		message: "Please provide an estimated budget.",
	}),
	targetUsers: z.string().min(10, {
		message: "Target users must be at least 10 characters.",
	}),
	businessCase: z.string().min(50, {
		message: "Business case must be at least 50 characters.",
	}),
	risks: z.string().min(20, {
		message: "Risks must be at least 20 characters.",
	}),
	termsAgreed: z.boolean().refine((val) => val === true, {
		message: "You must agree to the terms and conditions.",
	}),
});

export default function IdeaSubmissionPage() {
	const router = useRouter();
	const [activeTab, setActiveTab] = useState("overview");
	const [formProgress, setFormProgress] = useState(0);
	const [fileUploaded, setFileUploaded] = useState(false);
	const [fileName, setFileName] = useState("");

	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			title: "",
			summary: "",
			description: "",
			resources: "",
			budget: "",
			targetUsers: "",
			businessCase: "",
			risks: "",
			termsAgreed: false,
		},
	});

	const watchedFields = form.watch();

	// Calculate form progress
	const calculateProgress = () => {
		const fields = Object.values(watchedFields).filter(Boolean);
		const filledFields = fields.length;
		const totalFields = Object.keys(formSchema.shape).length;
		return Math.round((filledFields / totalFields) * 100);
	};

	const onSubmit = (values: z.infer<typeof formSchema>) => {
		// In a real app, you would submit this data to your backend
		console.log(values);

		// Use Sonner's toast for notifications
		toast.success(
			"Idea submitted successfully! Your idea has been submitted for review by the executive team."
		);

		// Redirect after successful submission (after a delay to show the toast)
		setTimeout(() => {
			router.push("/");
		}, 2000);
	};

	const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		if (e.target.files && e.target.files[0]) {
			setFileUploaded(true);
			setFileName(e.target.files[0].name);
		}
	};

	const updateTabAndProgress = (tab: string) => {
		setActiveTab(tab);
		setFormProgress(calculateProgress());
	};

	return (
		<div className="flex min-h-screen flex-col bg-gradient-to-br from-background to-secondary/20">
			{/* Header with updated horizontal padding */}
			<header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
				<div className="w-full px-4 md:px-8 flex h-16 items-center justify-between">
					<div className="flex gap-6 md:gap-10">
						<Link href="/" className="flex items-center space-x-2">
							<BookOpen className="h-6 w-6" />
							<span className="inline-block font-bold">Sioux Steel Wiki</span>
						</Link>
					</div>
					<div className="flex flex-1 items-center justify-end space-x-4">
						<Link href="/">
							<Button variant="ghost" size="sm" className="gap-1">
								<ChevronLeft className="h-4 w-4" />
								Back to Wiki
							</Button>
						</Link>
					</div>
				</div>
			</header>

			{/* Main content container with padding */}
			<main className="flex-1 py-8">
				<div className="w-full max-w-5xl px-4 md:px-8 mx-auto">
					<div className="mb-8 w-full flex flex-col items-center text-center">
						<div className="mb-2 flex items-center justify-center rounded-full bg-primary/10 p-3">
							<Sparkles className="h-8 w-10 text-primary" />
						</div>
						<h1 className="text-2xl font-extrabold leading-tight tracking-tighter md:text-5xl">
							Submit Your Product Idea
						</h1>
						<p className="mt-4 max-w-[700px] text-lg text-muted-foreground">
							Great ideas can come from anywhere. Share yours and help shape the
							future of Sioux Seel.
						</p>
					</div>

					<div className="mb-8 rounded-lg border bg-card p-4 shadow-sm">
						<div className="flex items-center gap-4">
							<div className="flex-1">
								<h3 className="text-sm font-medium">Form Completion</h3>
								<Progress value={formProgress} className="mt-2 h-2" />
							</div>
							<Badge
								variant={formProgress === 100 ? "default" : "outline"}
								className="gap-1"
							>
								{formProgress === 100 ? (
									<CheckCircle2 className="h-3 w-3" />
								) : (
									<AlertCircle className="h-3 w-3" />
								)}
								{formProgress}% Complete
							</Badge>
						</div>
					</div>

					<div className="grid gap-8 md:grid-cols-[300px_1fr]">
						<Card className="h-fit md:sticky md:top-20">
							<CardHeader>
								<CardTitle>Submission Guide</CardTitle>
								<CardDescription>
									Follow these steps to submit your idea
								</CardDescription>
							</CardHeader>
							<CardContent className="grid gap-4">
								<div
									className={`flex cursor-pointer items-center gap-3 rounded-md p-2 ${
										activeTab === "overview"
											? "bg-primary/10 text-primary"
											: "hover:bg-muted"
									}`}
									onClick={() => updateTabAndProgress("overview")}
								>
									<Lightbulb className="h-5 w-5" />
									<div>
										<p className="font-medium">Idea Overview</p>
										<p className="text-xs text-muted-foreground">
											Basic information about your idea
										</p>
									</div>
								</div>
								<div
									className={`flex cursor-pointer items-center gap-3 rounded-md p-2 ${
										activeTab === "impact"
											? "bg-primary/10 text-primary"
											: "hover:bg-muted"
									}`}
									onClick={() => updateTabAndProgress("impact")}
								>
									<Target className="h-5 w-5" />
									<div>
										<p className="font-medium">Business Impact</p>
										<p className="text-xs text-muted-foreground">
											How your idea benefits the company
										</p>
									</div>
								</div>
								<div
									className={`flex cursor-pointer items-center gap-3 rounded-md p-2 ${
										activeTab === "resources"
											? "bg-primary/10 text-primary"
											: "hover:bg-muted"
									}`}
									onClick={() => updateTabAndProgress("resources")}
								>
									<TrendingUp className="h-5 w-5" />
									<div>
										<p className="font-medium">Resources & Timeline</p>
										<p className="text-xs text-muted-foreground">
											What's needed to implement your idea
										</p>
									</div>
								</div>
								<div
									className={`flex cursor-pointer items-center gap-3 rounded-md p-2 ${
										activeTab === "documents"
											? "bg-primary/10 text-primary"
											: "hover:bg-muted"
									}`}
									onClick={() => updateTabAndProgress("documents")}
								>
									<Upload className="h-5 w-5" />
									<div>
										<p className="font-medium">Supporting Documents</p>
										<p className="text-xs text-muted-foreground">
											Upload additional materials
										</p>
									</div>
								</div>
							</CardContent>
							<CardFooter className="flex-col items-start gap-2 border-t bg-muted/50 px-6 py-4">
								<h4 className="text-sm font-medium">Tips for Success:</h4>
								<ul className="text-xs text-muted-foreground">
									<li className="mb-1">
										• Be specific about the problem your idea solves
									</li>
									<li className="mb-1">
										• Consider alignment with company goals
									</li>
									<li className="mb-1">
										• Provide realistic resource estimates
									</li>
									<li>• Include supporting research when possible</li>
								</ul>
							</CardFooter>
						</Card>

						<div>
							<Form {...form}>
								<form
									onSubmit={form.handleSubmit(onSubmit)}
									className="space-y-8"
								>
									<Tabs
										value={activeTab}
										onValueChange={updateTabAndProgress}
										className="w-full"
									>
										<TabsList className="grid w-full grid-cols-4">
											<TabsTrigger value="overview">Overview</TabsTrigger>
											<TabsTrigger value="impact">Impact</TabsTrigger>
											<TabsTrigger value="resources">Resources</TabsTrigger>
											<TabsTrigger value="documents">Documents</TabsTrigger>
										</TabsList>

										<TabsContent value="overview" className="space-y-6 pt-4">
											<div className="rounded-lg border bg-card p-6 shadow-sm">
												<h2 className="mb-4 text-xl font-semibold">
													Idea Overview
												</h2>
												<div className="space-y-4">
													<FormField
														control={form.control}
														name="title"
														render={({ field }) => (
															<FormItem>
																<FormLabel>Idea Title</FormLabel>
																<FormControl>
																	<Input
																		placeholder="Enter a concise title for your idea"
																		{...field}
																	/>
																</FormControl>
																<FormDescription>
																	A clear, descriptive title that captures the
																	essence of your idea.
																</FormDescription>
																<FormMessage />
															</FormItem>
														)}
													/>

													<FormField
														control={form.control}
														name="summary"
														render={({ field }) => (
															<FormItem>
																<FormLabel>Executive Summary</FormLabel>
																<FormControl>
																	<Textarea
																		placeholder="Provide a brief summary of your idea (1-2 sentences)"
																		className="resize-none"
																		{...field}
																	/>
																</FormControl>
																<FormDescription>
																	A concise overview that executives can quickly
																	understand.
																</FormDescription>
																<FormMessage />
															</FormItem>
														)}
													/>

													<div className="grid gap-4 md:grid-cols-2">
														<FormField
															control={form.control}
															name="category"
															render={({ field }) => (
																<FormItem>
																	<FormLabel>Idea Category</FormLabel>
																	<Select
																		onValueChange={field.onChange}
																		defaultValue={field.value}
																	>
																		<FormControl>
																			<SelectTrigger>
																				<SelectValue placeholder="Select a category" />
																			</SelectTrigger>
																		</FormControl>
																		<SelectContent>
																			<SelectItem value="product">
																				New Product
																			</SelectItem>
																			<SelectItem value="feature">
																				Product Feature
																			</SelectItem>
																			<SelectItem value="process">
																				Process Improvement
																			</SelectItem>
																			<SelectItem value="service">
																				New Service
																			</SelectItem>
																			<SelectItem value="technology">
																				Technology Innovation
																			</SelectItem>
																			<SelectItem value="other">
																				Other
																			</SelectItem>
																		</SelectContent>
																	</Select>
																	<FormMessage />
																</FormItem>
															)}
														/>

														<FormField
															control={form.control}
															name="department"
															render={({ field }) => (
																<FormItem>
																	<FormLabel>Related Department</FormLabel>
																	<Select
																		onValueChange={field.onChange}
																		defaultValue={field.value}
																	>
																		<FormControl>
																			<SelectTrigger>
																				<SelectValue placeholder="Select a department" />
																			</SelectTrigger>
																		</FormControl>
																		<SelectContent>
																			<SelectItem value="innovation">
																				Innovation R&amp;D
																			</SelectItem>
																			<SelectItem value="engineering">
																				Engineering
																			</SelectItem>
																			<SelectItem value="it">
																				Information Technology
																			</SelectItem>
																			<SelectItem value="accounting">
																				Accounting
																			</SelectItem>
																			<SelectItem value="marketing">
																				Marketing
																			</SelectItem>
																			<SelectItem value="multiple">
																				Multiple Departments
																			</SelectItem>
																		</SelectContent>
																	</Select>
																	<FormMessage />
																</FormItem>
															)}
														/>
													</div>

													<FormField
														control={form.control}
														name="description"
														render={({ field }) => (
															<FormItem>
																<FormLabel>Detailed Description</FormLabel>
																<FormControl>
																	<Textarea
																		placeholder="Provide a comprehensive description of your idea, including the problem it solves and how it works"
																		className="min-h-[150px]"
																		{...field}
																	/>
																</FormControl>
																<FormDescription>
																	Be thorough and specific. Include technical
																	details if relevant.
																</FormDescription>
																<FormMessage />
															</FormItem>
														)}
													/>
												</div>
											</div>
										</TabsContent>

										<TabsContent value="impact" className="space-y-6 pt-4">
											<div className="rounded-lg border bg-card p-6 shadow-sm">
												<h2 className="mb-4 text-xl font-semibold">
													Business Impact
												</h2>
												<div className="space-y-4">
													<FormField
														control={form.control}
														name="impact"
														render={({ field }) => (
															<FormItem className="space-y-3">
																<FormLabel>Potential Impact</FormLabel>
																<FormControl>
																	<RadioGroup
																		onValueChange={field.onChange}
																		defaultValue={field.value}
																		className="flex flex-col space-y-1"
																	>
																		<FormItem className="flex items-center space-x-3 space-y-0">
																			<FormControl>
																				<RadioGroupItem value="incremental" />
																			</FormControl>
																			<FormLabel className="font-normal">
																				Incremental - Minor improvements to
																				existing products/processes
																			</FormLabel>
																		</FormItem>
																		<FormItem className="flex items-center space-x-3 space-y-0">
																			<FormControl>
																				<RadioGroupItem value="significant" />
																			</FormControl>
																			<FormLabel className="font-normal">
																				Significant - Notable improvements with
																				measurable benefits
																			</FormLabel>
																		</FormItem>
																		<FormItem className="flex items-center space-x-3 space-y-0">
																			<FormControl>
																				<RadioGroupItem value="transformative" />
																			</FormControl>
																			<FormLabel className="font-normal">
																				Transformative - Game-changing
																				innovation with major impact
																			</FormLabel>
																		</FormItem>
																		<FormItem className="flex items-center space-x-3 space-y-0">
																			<FormControl>
																				<RadioGroupItem value="disruptive" />
																			</FormControl>
																			<FormLabel className="font-normal">
																				Disruptive - Revolutionary concept that
																				creates new markets
																			</FormLabel>
																		</FormItem>
																	</RadioGroup>
																</FormControl>
																<FormMessage />
															</FormItem>
														)}
													/>

													<FormField
														control={form.control}
														name="targetUsers"
														render={({ field }) => (
															<FormItem>
																<FormLabel>
																	Target Users/Beneficiaries
																</FormLabel>
																<FormControl>
																	<Textarea
																		placeholder="Who will benefit from this idea? (internal teams, customers, etc.)"
																		className="resize-none"
																		{...field}
																	/>
																</FormControl>
																<FormDescription>
																	Identify all stakeholders who would be
																	impacted by your idea.
																</FormDescription>
																<FormMessage />
															</FormItem>
														)}
													/>

													<FormField
														control={form.control}
														name="businessCase"
														render={({ field }) => (
															<FormItem>
																<FormLabel>Business Case</FormLabel>
																<FormControl>
																	<Textarea
																		placeholder="Explain how this idea aligns with company goals and creates value"
																		className="min-h-[150px]"
																		{...field}
																	/>
																</FormControl>
																<FormDescription>
																	Describe the business value, competitive
																	advantage, or efficiency gains.
																</FormDescription>
																<FormMessage />
															</FormItem>
														)}
													/>

													<FormField
														control={form.control}
														name="risks"
														render={({ field }) => (
															<FormItem>
																<FormLabel>
																	Potential Risks & Challenges
																</FormLabel>
																<FormControl>
																	<Textarea
																		placeholder="What obstacles might be encountered? How might they be addressed?"
																		className="resize-none"
																		{...field}
																	/>
																</FormControl>
																<FormDescription>
																	Be honest about potential challenges to
																	demonstrate thorough consideration.
																</FormDescription>
																<FormMessage />
															</FormItem>
														)}
													/>
												</div>
											</div>
										</TabsContent>

										<TabsContent value="resources" className="space-y-6 pt-4">
											<div className="rounded-lg border bg-card p-6 shadow-sm">
												<h2 className="mb-4 text-xl font-semibold">
													Resources & Timeline
												</h2>
												<div className="space-y-4">
													<FormField
														control={form.control}
														name="resources"
														render={({ field }) => (
															<FormItem>
																<FormLabel>Required Resources</FormLabel>
																<FormControl>
																	<Textarea
																		placeholder="What people, skills, technologies, or other resources would be needed?"
																		className="min-h-[100px]"
																		{...field}
																	/>
																</FormControl>
																<FormDescription>
																	Be specific about the resources required to
																	implement your idea.
																</FormDescription>
																<FormMessage />
															</FormItem>
														)}
													/>

													<div className="grid gap-4 md:grid-cols-2">
														<FormField
															control={form.control}
															name="budget"
															render={({ field }) => (
																<FormItem>
																	<FormLabel>Estimated Budget</FormLabel>
																	<div className="relative">
																		<DollarSign className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
																		<FormControl>
																			<Input
																				className="pl-8"
																				placeholder="Estimated cost"
																				{...field}
																			/>
																		</FormControl>
																	</div>
																	<FormDescription>
																		Provide your best estimate of the required
																		investment.
																	</FormDescription>
																	<FormMessage />
																</FormItem>
															)}
														/>

														<FormField
															control={form.control}
															name="timeframe"
															render={({ field }) => (
																<FormItem>
																	<FormLabel>Estimated Timeframe</FormLabel>
																	<Select
																		onValueChange={field.onChange}
																		defaultValue={field.value}
																	>
																		<FormControl>
																			<SelectTrigger className="w-full">
																				<SelectValue placeholder="Select timeframe" />
																			</SelectTrigger>
																		</FormControl>
																		<SelectContent>
																			<SelectItem value="quick">
																				Quick Win (1-3 months)
																			</SelectItem>
																			<SelectItem value="medium">
																				Medium Term (3-6 months)
																			</SelectItem>
																			<SelectItem value="long">
																				Long Term (6-12 months)
																			</SelectItem>
																			<SelectItem value="strategic">
																				Strategic (1+ years)
																			</SelectItem>
																		</SelectContent>
																	</Select>
																	<FormDescription>
																		How long would it take to implement this
																		idea?
																	</FormDescription>
																	<FormMessage />
																</FormItem>
															)}
														/>
													</div>

													<div className="rounded-lg bg-muted p-4">
														<div className="flex items-start gap-3">
															<Clock className="mt-0.5 h-5 w-5 text-muted-foreground" />
															<div>
																<h4 className="font-medium">
																	Implementation Phases
																</h4>
																<p className="mt-1 text-sm text-muted-foreground">
																	Consider breaking down your idea into phases
																	for easier implementation and evaluation:
																</p>
																<ul className="mt-2 space-y-1 text-sm text-muted-foreground">
																	<li>• Phase 1: Proof of concept/prototype</li>
																	<li>• Phase 2: Limited testing/pilot</li>
																	<li>• Phase 3: Full implementation</li>
																	<li>• Phase 4: Evaluation and refinement</li>
																</ul>
															</div>
														</div>
													</div>
												</div>
											</div>
										</TabsContent>

										<TabsContent value="documents" className="space-y-6 pt-4">
											<div className="rounded-lg border bg-card p-6 shadow-sm">
												<h2 className="mb-4 text-xl font-semibold">
													Supporting Documents
												</h2>
												<div className="space-y-6">
													<div>
														<h3 className="mb-2 text-sm font-medium">
															Upload Project Charter or Additional Documentation
														</h3>
														<div className="rounded-lg border border-dashed p-8 text-center">
															<div className="mx-auto flex max-w-[420px] flex-col items-center justify-center">
																<div className="mb-4 rounded-full bg-muted p-3">
																	<Upload className="h-6 w-6 text-muted-foreground" />
																</div>

																{fileUploaded ? (
																	<div className="space-y-2">
																		<Badge
																			variant="outline"
																			className="gap-1 px-3 py-1.5"
																		>
																			<CheckCircle2 className="h-3.5 w-3.5 text-green-500" />
																			{fileName}
																		</Badge>
																		<p className="text-sm text-muted-foreground">
																			File uploaded successfully
																		</p>
																		<Button
																			variant="outline"
																			size="sm"
																			onClick={() => {
																				setFileUploaded(false);
																				setFileName("");
																			}}
																		>
																			Remove
																		</Button>
																	</div>
																) : (
																	<>
																		<p className="mb-2 text-sm font-medium">
																			Drag and drop your files here or click to
																			browse
																		</p>
																		<p className="text-xs text-muted-foreground">
																			Support for PDF, DOCX, PPTX, XLSX (Max
																			10MB)
																		</p>
																		<div className="mt-4">
																			<Input
																				id="file-upload"
																				type="file"
																				className="hidden"
																				onChange={handleFileChange}
																			/>
																			<Button
																				variant="outline"
																				onClick={() =>
																					document
																						.getElementById("file-upload")
																						?.click()
																				}
																			>
																				Select File
																			</Button>
																		</div>
																	</>
																)}
															</div>
														</div>
													</div>

													<Separator />

													<div className="space-y-4">
														<h3 className="text-sm font-medium">
															Document Suggestions
														</h3>
														<div className="grid gap-4 md:grid-cols-2">
															<div className="rounded-lg border p-4">
																<h4 className="font-medium">
																	Project Charter Template
																</h4>
																<p className="mt-1 text-sm text-muted-foreground">
																	A structured document outlining the purpose,
																	goals, and scope of your proposed idea.
																</p>
																<Button
																	variant="link"
																	className="mt-2 h-auto p-0 text-sm"
																>
																	Download Template
																</Button>
															</div>
															<div className="rounded-lg border p-4">
																<h4 className="font-medium">
																	Business Case Template
																</h4>
																<p className="mt-1 text-sm text-muted-foreground">
																	A template to help you articulate the
																	financial and strategic benefits of your idea.
																</p>
																<Button
																	variant="link"
																	className="mt-2 h-auto p-0 text-sm"
																>
																	Download Template
																</Button>
															</div>
														</div>
													</div>

													<FormField
														control={form.control}
														name="termsAgreed"
														render={({ field }) => (
															<FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
																<FormControl>
																	<Checkbox
																		checked={field.value}
																		onCheckedChange={field.onChange}
																	/>
																</FormControl>
																<div className="space-y-1 leading-none">
																	<FormLabel>
																		I understand and agree to the following:
																	</FormLabel>
																	<FormDescription>
																		By submitting this idea, I acknowledge that
																		it will be reviewed by the executive team
																		and may be shared with relevant
																		stakeholders. I understand that the company
																		reserves the right to implement this idea at
																		its discretion, and that submission does not
																		guarantee implementation.
																	</FormDescription>
																</div>
																<FormMessage />
															</FormItem>
														)}
													/>
												</div>
											</div>
										</TabsContent>
									</Tabs>

									<div className="flex justify-between">
										<Button
											type="button"
											variant="outline"
											onClick={() => router.push("/")}
										>
											Cancel
										</Button>
										<Button
											type="submit"
											disabled={formProgress < 100}
											className="gap-2"
										>
											<Sparkles className="h-4 w-4" />
											Submit Idea
										</Button>
									</div>
								</form>
							</Form>
						</div>
					</div>
				</div>
			</main>

			{/* Footer with updated padding */}
			<footer className="border-t py-6">
				<div className="w-full px-4 md:px-8 flex flex-col items-center justify-between gap-4 md:h-16 md:flex-row">
					<p className="text-center text-sm leading-loose text-muted-foreground md:text-left">
						&copy; {new Date().getFullYear()} Sioux Steel Co. All rights
						reserved.
					</p>
					<p className="text-center text-sm leading-loose text-muted-foreground md:text-left">
						Innovation starts with you
					</p>
				</div>
			</footer>

			{/* Sonner Toaster Component */}
			<Toaster />
		</div>
	);
}
