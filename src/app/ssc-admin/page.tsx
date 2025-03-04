"use client";
import { useState, useEffect } from "react";
import {
	DollarSign,
	Users,
	CheckCircle,
	Activity,
	Settings,
	LogOut,
	Download,
	BarChart4,
	Clock,
	Briefcase,
	ChevronDown,
	Info,
	FileText,
	Search,
	Filter,
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
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from "@/components/ui/tooltip";
import {
	Sheet,
	SheetContent,
	SheetDescription,
	SheetHeader,
	SheetTitle,
	SheetTrigger,
} from "@/components/ui/sheet";

// Importing Chart.js
import {
	Chart as ChartJS,
	CategoryScale,
	LinearScale,
	BarElement,
	Title,
	Tooltip as ChartTooltip,
	Legend,
	ArcElement,
	PointElement,
	LineElement,
} from "chart.js";
import { Doughnut, Line } from "react-chartjs-2";

ChartJS.register(
	CategoryScale,
	LinearScale,
	BarElement,
	Title,
	ChartTooltip,
	Legend,
	ArcElement,
	PointElement,
	LineElement
);
import { getQualifiedHoursBreakdown } from "@/services/qualifiedHoursService";

// Fallback market rates if a given category is missing a rate from the service.
const marketRateRubric: Record<string, number> = {
	Development: 80,
	"UX/UI": 70,
	"Project Management": 90,
	Research: 75,
	"Content Creation": 65,
	Testing: 60,
	Documentation: 55,
	Prototyping: 0,
};

export default function AdminDashboard() {
	// State for live qualified hours data
	const [hoursData, setHoursData] = useState<any[]>([]);
	const [qualifiedBreakdown, setQualifiedBreakdown] = useState<{
		breakdown: Record<
			string,
			{
				totalHours: number;
				marketRate: number;
				assignees: Record<string, number>;
			}
		>;
		grandTotal: number;
		tickets?: any[];
	} | null>(null);

	// State for the project selection dropdown.
	const [selectedProject, setSelectedProject] = useState<string | null>(null);
	// (For now, a static projects array is used. Replace with live data as needed.)
	const projects = ["Project A", "Project B", "Project C"];

	// Compute summary values from the fetched breakdown.
	const qualifiedTotalHours = qualifiedBreakdown
		? Object.values(qualifiedBreakdown.breakdown).reduce(
				(sum, item) => sum + item.totalHours,
				0
		  )
		: 0;
	const qualifiedGrandTotal = qualifiedBreakdown
		? Object.values(qualifiedBreakdown.breakdown).reduce(
				(sum, item) => sum + item.totalHours * item.marketRate,
				0
		  )
		: 0;
	const qualifiedAverageRate =
		qualifiedTotalHours > 0 ? qualifiedGrandTotal / qualifiedTotalHours : 0;

	// Fetch data from the service.
	const fetchData = async () => {
		try {
			const { breakdown, grandTotal, tickets } =
				await getQualifiedHoursBreakdown();
			setQualifiedBreakdown({ breakdown, grandTotal });
			if (tickets) {
				setHoursData(tickets);
			}
		} catch (error) {
			console.error("Error fetching qualified hours breakdown:", error);
		}
	};

	useEffect(() => {
		fetchData();
	}, []);

	// Build chart data for “Hours per Category”
	const breakdownChartData = {
		labels: qualifiedBreakdown ? Object.keys(qualifiedBreakdown.breakdown) : [],
		datasets: [
			{
				label: "Hours Spent",
				data: qualifiedBreakdown
					? Object.values(qualifiedBreakdown.breakdown).map(
							(item) => item.totalHours
					  )
					: [],
				backgroundColor: [
					"rgba(94, 53, 177, 0.7)",
					"rgba(33, 150, 243, 0.7)",
					"rgba(0, 150, 136, 0.7)",
					"rgba(255, 152, 0, 0.7)",
					"rgba(233, 30, 99, 0.7)",
					"rgba(63, 81, 181, 0.7)",
					"rgba(156, 39, 176, 0.7)",
				],
				borderColor: [
					"rgba(94, 53, 177, 1)",
					"rgba(33, 150, 243, 1)",
					"rgba(0, 150, 136, 1)",
					"rgba(255, 152, 0, 1)",
					"rgba(233, 30, 99, 1)",
					"rgba(63, 81, 181, 1)",
					"rgba(156, 39, 176, 1)",
				],
				borderWidth: 1,
			},
		],
	};

	const chartOptions = {
		responsive: true,
		plugins: {
			legend: { position: "top" as const },
			title: { display: true, text: "Hours per Category" },
		},
	};

	// Export report action.
	const exportReport = () => {
		console.log("Exporting report...");
		alert("Report exported successfully!");
	};

	return (
		<div className="flex min-h-screen bg-slate-50 dark:bg-slate-900">
			<main className="flex-1 p-6 md:p-8 lg:p-12">
				{/* Header with title, project selection, and user dropdown */}
				<div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
					<h1 className="text-3xl font-bold text-slate-800 dark:text-white">
						Admin Dashboard
					</h1>
					<div className="flex items-center space-x-4">
						{/* Project Selection Dropdown */}
						<DropdownMenu>
							<DropdownMenuTrigger asChild>
								<Button
									variant="outline"
									className="px-4 py-2 flex items-center gap-2"
								>
									<Briefcase className="h-4 w-4" />
									{selectedProject || "Select Project"}
									<ChevronDown className="h-4 w-4 ml-1" />
								</Button>
							</DropdownMenuTrigger>
							<DropdownMenuContent className="w-56" align="end">
								<DropdownMenuLabel>Select a Project</DropdownMenuLabel>
								<DropdownMenuSeparator />
								{projects.map((project) => (
									<DropdownMenuItem
										key={project}
										onClick={() => setSelectedProject(project)}
									>
										{project}
									</DropdownMenuItem>
								))}
							</DropdownMenuContent>
						</DropdownMenu>
						{/* User Dropdown */}
						<DropdownMenu>
							<DropdownMenuTrigger asChild>
								<Button
									variant="ghost"
									className="relative h-10 w-10 rounded-full"
								>
									<Avatar className="h-10 w-10 border-2 border-primary/10">
										<AvatarImage
											src="/placeholder.svg?height=40&width=40"
											alt="@adminuser"
										/>
										<AvatarFallback>AU</AvatarFallback>
									</Avatar>
								</Button>
							</DropdownMenuTrigger>
							<DropdownMenuContent className="w-56" align="end" forceMount>
								<DropdownMenuLabel className="font-normal">
									<div className="flex flex-col space-y-1">
										<p className="text-sm font-medium">Admin User</p>
										<p className="text-xs leading-none text-muted-foreground">
											admin@example.com
										</p>
									</div>
								</DropdownMenuLabel>
								<DropdownMenuSeparator />
								<DropdownMenuItem>
									<Settings className="mr-2 h-4 w-4" />
									<span>Settings</span>
								</DropdownMenuItem>
								<DropdownMenuItem>
									<LogOut className="mr-2 h-4 w-4" />
									<span>Log out</span>
								</DropdownMenuItem>
							</DropdownMenuContent>
						</DropdownMenu>
					</div>
				</div>

				<Tabs defaultValue="overview" className="space-y-6">
					<TabsList className="grid grid-cols-2 md:w-auto">
						<TabsTrigger value="overview" className="flex items-center gap-2">
							<BarChart4 className="h-4 w-4" />
							<span className="hidden sm:inline">Overview</span>
						</TabsTrigger>
						<TabsTrigger
							value="qualified-hours"
							className="flex items-center gap-2"
						>
							<Clock className="h-4 w-4" />
							<span className="hidden sm:inline">Qualified Hours</span>
						</TabsTrigger>
					</TabsList>

					{/* Overview Tab – metrics from live data */}
					<TabsContent value="overview" className="space-y-6">
						<Card className="shadow-sm hover:shadow transition-shadow">
							<CardHeader>
								<CardTitle>Qualified Hours Overview</CardTitle>
								<CardDescription>
									Summary based on the live data feed.
								</CardDescription>
							</CardHeader>
							<CardContent>
								<div className="grid grid-cols-1 md:grid-cols-3 gap-6">
									<div className="flex flex-col">
										<span className="text-sm text-slate-500 dark:text-slate-400">
											Total Qualified Hours
										</span>
										<span className="text-3xl font-bold">
											{qualifiedTotalHours}
										</span>
									</div>
									<div className="flex flex-col">
										<span className="text-sm text-slate-500 dark:text-slate-400">
											Average Hourly Rate
										</span>
										<span className="text-3xl font-bold">
											${qualifiedAverageRate.toFixed(2)}
										</span>
									</div>
									<div className="flex flex-col">
										<span className="text-sm text-slate-500 dark:text-slate-400">
											Total Cost
										</span>
										<span className="text-3xl font-bold text-purple-700 dark:text-purple-400">
											${qualifiedGrandTotal.toLocaleString()}
										</span>
									</div>
								</div>
							</CardContent>
							<CardFooter className="flex justify-end">
								<Button
									onClick={exportReport}
									className="flex items-center gap-2"
								>
									<Download className="h-4 w-4" />
									Export Report
								</Button>
							</CardFooter>
						</Card>
					</TabsContent>

					{/* Qualified Hours Tab */}
					<TabsContent value="qualified-hours" className="space-y-6">
						{/* Search and filter controls */}
						<div className="flex flex-col sm:flex-row gap-4 mb-2">
							<div className="relative flex-1">
								<Search className="absolute left-2.5 top-2.5 h-4 w-4 text-slate-400" />
								<Input
									placeholder="Search by name, department or category..."
									className="pl-9"
								/>
							</div>
							<Button variant="outline" className="flex items-center gap-2">
								<Filter className="h-4 w-4" />
								<span>Filters</span>
							</Button>
							<Button
								variant="default"
								className="flex items-center gap-2"
								onClick={exportReport}
							>
								<Download className="h-4 w-4" />
								<span>Export Report</span>
							</Button>
						</div>

						{/* Grand Total Card – uses live data */}
						<Card className="bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20 border-none shadow-sm">
							<CardHeader>
								<CardTitle className="text-lg">
									Project Grand Total (Qualified Hours)
								</CardTitle>
								<CardDescription>
									Summary of qualified hours and costs using market rates.
								</CardDescription>
							</CardHeader>
							<CardContent>
								<div className="grid grid-cols-1 md:grid-cols-3 gap-6">
									<div className="flex flex-col">
										<span className="text-sm text-slate-500 dark:text-slate-400">
											Total Hours
										</span>
										<span className="text-3xl font-bold">
											{qualifiedTotalHours}
										</span>
									</div>
									<div className="flex flex-col">
										<span className="text-sm text-slate-500 dark:text-slate-400">
											Average Hourly Rate
										</span>
										<span className="text-3xl font-bold">
											${qualifiedAverageRate.toFixed(2)}
										</span>
									</div>
									<div className="flex flex-col">
										<span className="text-sm text-slate-500 dark:text-slate-400">
											Total Cost
										</span>
										<span className="text-3xl font-bold text-purple-700 dark:text-purple-400">
											${qualifiedGrandTotal.toLocaleString()}
										</span>
									</div>
								</div>
							</CardContent>
							<CardFooter className="border-t pt-4 flex justify-end">
								<div className="flex gap-2">
									<Badge
										variant="outline"
										className="bg-green-50 text-green-700 border-green-200"
									>
										{hoursData.filter((h) => h.status === "approved").length}{" "}
										Approved
									</Badge>
									<Badge
										variant="outline"
										className="bg-amber-50 text-amber-700 border-amber-200"
									>
										{hoursData.filter((h) => h.status === "pending").length}{" "}
										Pending
									</Badge>
									<Badge
										variant="outline"
										className="bg-red-50 text-red-700 border-red-200"
									>
										{hoursData.filter((h) => h.status === "denied").length}{" "}
										Denied
									</Badge>
								</div>
							</CardFooter>
						</Card>

						{/* Chart and Detailed Breakdown */}
						<div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
							<Card className="shadow-sm hover:shadow transition-shadow">
								<CardHeader>
									<CardTitle>Hours per Category</CardTitle>
									<CardDescription>
										Distribution of hours across categories.
									</CardDescription>
								</CardHeader>
								<CardContent className="flex justify-center">
									<div className="w-full">
										{qualifiedBreakdown ? (
											<Doughnut
												options={chartOptions}
												data={breakdownChartData}
											/>
										) : (
											<p>Loading chart...</p>
										)}
									</div>
								</CardContent>
							</Card>

							<Card className="shadow-sm hover:shadow transition-shadow">
								<CardHeader className="flex flex-row items-center justify-between">
									<div>
										<CardTitle>Category Breakdown</CardTitle>
										<CardDescription>
											Detailed view of hours by category with market rates.
										</CardDescription>
									</div>
									<Sheet>
										<SheetTrigger asChild>
											<Button variant="outline" size="sm">
												<FileText className="h-4 w-4 mr-2" />
												Detailed View
											</Button>
										</SheetTrigger>
										<SheetContent className="w-[400px] sm:w-[540px]">
											<SheetHeader>
												<SheetTitle>Category Details</SheetTitle>
												<SheetDescription>
													Breakdown figures and market rates.
												</SheetDescription>
											</SheetHeader>
											<div className="mt-6">
												<Table>
													<TableHeader>
														<TableRow>
															<TableHead>Category</TableHead>
															<TableHead>Hours</TableHead>
															<TableHead>Market Rate ($)</TableHead>
															<TableHead>Cost</TableHead>
															<TableHead>% of Total</TableHead>
														</TableRow>
													</TableHeader>
													<TableBody>
														{qualifiedBreakdown &&
															Object.keys(qualifiedBreakdown.breakdown).map(
																(category) => {
																	const item =
																		qualifiedBreakdown.breakdown[category];
																	const hours = item.totalHours;
																	const marketRate =
																		item.marketRate ||
																		marketRateRubric[category] ||
																		0;
																	const cost = hours * marketRate;
																	const totalChartHours = Object.values(
																		qualifiedBreakdown.breakdown
																	).reduce((a, b) => a + b.totalHours, 0);
																	const percentage = totalChartHours
																		? Math.round(
																				(hours / totalChartHours) * 100
																		  )
																		: 0;
																	return (
																		<TableRow key={category}>
																			<TableCell className="font-medium">
																				{category}
																			</TableCell>
																			<TableCell>{hours}</TableCell>
																			<TableCell>{marketRate}</TableCell>
																			<TableCell>
																				${cost.toLocaleString()}
																			</TableCell>
																			<TableCell>{percentage}%</TableCell>
																		</TableRow>
																	);
																}
															)}
													</TableBody>
												</Table>
											</div>
										</SheetContent>
									</Sheet>
								</CardHeader>
								<CardContent>
									<Table>
										<TableHeader>
											<TableRow>
												<TableHead>Category</TableHead>
												<TableHead>Hours</TableHead>
												<TableHead>Market Rate ($)</TableHead>
												<TableHead>Cost</TableHead>
											</TableRow>
										</TableHeader>
										<TableBody>
											{qualifiedBreakdown &&
												Object.keys(qualifiedBreakdown.breakdown).map(
													(category) => {
														const item = qualifiedBreakdown.breakdown[category];
														const hours = item.totalHours;
														const marketRate =
															item.marketRate ||
															marketRateRubric[category] ||
															0;
														const cost = hours * marketRate;
														return (
															<TableRow key={category}>
																<TableCell className="font-medium">
																	{category}
																</TableCell>
																<TableCell>{hours}</TableCell>
																<TableCell>{marketRate}</TableCell>
																<TableCell>${cost.toLocaleString()}</TableCell>
															</TableRow>
														);
													}
												)}
										</TableBody>
									</Table>
								</CardContent>
							</Card>
						</div>

						{/* Detailed Qualified Hours Report */}
						<Card className="shadow-sm hover:shadow transition-shadow">
							<CardHeader>
								<CardTitle>Qualified Hours Report</CardTitle>
								<CardDescription>
									Breakdown of hours, market rates, total cost, and assignees.
								</CardDescription>
							</CardHeader>
							<CardContent>
								{qualifiedBreakdown ? (
									<Table>
										<TableHeader>
											<TableRow>
												<TableHead>Category</TableHead>
												<TableHead>Total Hours</TableHead>
												<TableHead>Market Rate ($)</TableHead>
												<TableHead>Total Cost</TableHead>
												<TableHead>Assignees</TableHead>
											</TableRow>
										</TableHeader>
										<TableBody>
											{Object.entries(qualifiedBreakdown.breakdown).map(
												([category, data]) => {
													const totalCost = data.totalHours * data.marketRate;
													const assignees = Object.entries(data.assignees)
														.map(([name, hrs]) => `${name} (${hrs})`)
														.join(", ");
													return (
														<TableRow key={category}>
															<TableCell className="font-medium">
																{category}
															</TableCell>
															<TableCell>{data.totalHours}</TableCell>
															<TableCell>{data.marketRate}</TableCell>
															<TableCell>
																${totalCost.toLocaleString()}
															</TableCell>
															<TableCell>{assignees}</TableCell>
														</TableRow>
													);
												}
											)}
										</TableBody>
									</Table>
								) : (
									<p>No qualified hours data available.</p>
								)}
							</CardContent>
							<CardFooter className="flex justify-end border-t pt-4">
								<Button
									onClick={exportReport}
									className="flex items-center gap-2"
								>
									<Download className="h-4 w-4" />
									Export Report
								</Button>
							</CardFooter>
						</Card>
					</TabsContent>
				</Tabs>
			</main>
		</div>
	);
}
