"use client";
import { useState, useEffect } from "react";
import useSWR from "swr";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { useAuth } from "@/context/authContext";
import {
  login as loginService,
  logout,
  getLoggedInUser,
} from "@/services/auth/service";
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
import { projectService } from "@/services/projects/service";
import { cp } from "fs";

// Fallback market rates if a given category is missing a rate from the service.
const marketRateRubric: Record<string, number> = {
  Development: 120,
  "UX/UI": 120,
  "Project Management": 90,
  Research: 100,
  "Content Creation": 65,
  Testing: 80,
  Documentation: 80,
  Prototyping: 120,
};

/* --------------------------------------------------------------------------
   Login Component
   -------------------------------------------------------------------------- */
function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      // Call our auth service login method.
      await loginService(email, password);
      // The AuthContext's onAuthStateChange will update the user.
    } catch (err: any) {
      setError(err.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-slate-50 dark:bg-slate-900">
      <form
        onSubmit={handleSubmit}
        className="bg-white dark:bg-slate-800 p-8 rounded shadow-md w-full max-w-sm"
      >
        <h2 className="text-2xl font-bold mb-4 text-center">SSC Admin Login</h2>
        {error && <p className="text-red-500 mb-4">{error}</p>}
        <div className="mb-4">
          <label htmlFor="email" className="block mb-1">
            Email
          </label>
          <Input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div className="mb-6">
          <label htmlFor="password" className="block mb-1">
            Password
          </label>
          <Input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <Button type="submit" disabled={loading} className="w-full">
          {loading ? "Logging in..." : "Login"}
        </Button>
      </form>
    </div>
  );
}

/* --------------------------------------------------------------------------
   AdminDashboard Component
   -------------------------------------------------------------------------- */
export default function AdminDashboard() {
  const { user } = useAuth();
  const [userProfile, setUserProfile] = useState<any>(null);
  const [selectedProject, setSelectedProject] = useState<string | null>(null);
  // New state for filtering by project lead.
  const [selectedProjectLead, setSelectedProjectLead] = useState<string | null>(
    null
  );
  // New state for editable market rates.
  const [editableMarketRates, setEditableMarketRates] = useState<
    Record<string, number>
  >({ ...marketRateRubric });

  // Handler to update market rate for a category.
  const handleMarketRateChange = (category: string, value: number) => {
    setEditableMarketRates((prev) => ({ ...prev, [category]: value }));
  };

  // Fetch extra user details.
  useEffect(() => {
    if (user) {
      getLoggedInUser().then((response) => {
        if (response && response.user) {
          setUserProfile(response.user);
        }
      });
    }
  }, [user]);

  // Use SWR for caching the qualified hours data (including breakdown and tickets).
  const {
    data: qualifiedData,
    error: qualifiedError,
    isLoading: isQualifiedLoading,
  } = useSWR(
    user ? "qualified-hours" : null,
    async () => {
      const { breakdown, grandTotal, tickets } =
        await getQualifiedHoursBreakdown();
      return { breakdown, grandTotal, tickets };
    },
    {
      refreshInterval: 60000, // Revalidate every minute
      dedupingInterval: 30000, // Avoid duplicate requests within 30 seconds
    }
  );

  // Use SWR for caching the project list.
  const {
    data: projectList,
    error: projectError,
    isLoading: isProjectsLoading,
  } = useSWR(
    user ? "projects" : null,
    async () => await projectService.getFormattedProjectList(),
    {
      refreshInterval: 60000,
      dedupingInterval: 30000,
    }
  );

  // Unified loading state.
  const isLoading = isQualifiedLoading || isProjectsLoading;

  // Compute summary values.
  const qualifiedTotalHours = qualifiedData
    ? Object.values(qualifiedData.breakdown).reduce(
        (sum, item: any) => sum + item.totalHours,
        0
      )
    : 0;
  const qualifiedGrandTotal = qualifiedData
    ? Object.entries(qualifiedData.breakdown).reduce(
        (sum, [category, item]: [string, any]) =>
          sum +
          item.totalHours *
            (editableMarketRates[category] !== undefined
              ? editableMarketRates[category]
              : item.marketRate || 0),
        0
      )
    : 0;
  const qualifiedAverageRate =
    qualifiedTotalHours > 0 ? qualifiedGrandTotal / qualifiedTotalHours : 0;
  // Calculate the discounted total (Priority Discount = 30% reduction)
  const discountedTotal = qualifiedGrandTotal * 0.7;
  // Use the tickets data from the qualifiedData for badges.
  const hoursData = qualifiedData?.tickets || [];

  // Build chart data.
  const breakdownChartData = {
    labels: qualifiedData ? Object.keys(qualifiedData.breakdown) : [],
    datasets: [
      {
        label: "Hours Spent",
        data: qualifiedData
          ? Object.values(qualifiedData.breakdown).map(
              (item: any) => item.totalHours
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

  // Updated exportReport function using dynamic imports
  const exportReport = async () => {
    if (!qualifiedData) {
      alert("Qualified data is not yet available.");
      return;
    }

    try {
      // Dynamically import jsPDF and autoTable
      const { default: jsPDF } = await import("jspdf");
      const { default: autoTable } = await import("jspdf-autotable");

      const doc = new jsPDF();

      // Add title and summary information
      doc.setFontSize(18);
      doc.text("Itemized Qualified Hours Report", 14, 22);

      doc.setFontSize(12);
      doc.text(`Total Qualified Hours: ${qualifiedTotalHours}`, 14, 32);
      doc.text(
        `Average Hourly Rate: $${qualifiedAverageRate.toFixed(2)}`,
        14,
        40
      );
      doc.text(`Total Cost: $${qualifiedGrandTotal.toLocaleString()}`, 14, 48);
      doc.text(
        `Priority Discount (30% off): $${discountedTotal.toLocaleString()}`,
        14,
        56
      );

      // Prepare table data
      const tableColumn = [
        "Category",
        "Hours",
        "Market Rate ($)",
        "Cost ($)",
        "Discounted Cost ($)",
      ];
      const tableRows: Array<string | number>[] = [];

      Object.keys(qualifiedData.breakdown).forEach((category) => {
        const item = qualifiedData.breakdown[category];
        const hours = item.totalHours;
        const effectiveMarketRate =
          editableMarketRates[category] !== undefined
            ? editableMarketRates[category]
            : item.marketRate || 0;
        const cost = hours * effectiveMarketRate;
        const discountedCost = cost * 0.7;

        tableRows.push([
          category,
          hours,
          effectiveMarketRate,
          cost.toLocaleString(),
          discountedCost.toLocaleString(),
        ]);
      });

      // Use autoTable as a function, passing the document as the first argument.
      autoTable(doc, {
        head: [tableColumn],
        body: tableRows,
        startY: 65,
        styles: { fontSize: 10 },
        headStyles: { fillColor: [94, 53, 177] },
      });

      doc.save("itemized-report.pdf");
    } catch (error) {
      console.error("Error exporting report:", error);
    }
  };

  // --- New: Derive unique project leads for filtering ---
  const projectLeads =
    projectList?.reduce((leads: string[], project: any) => {
      if (project.lead?.name && !leads.includes(project.lead.name)) {
        leads.push(project.lead.name);
      }
      return leads;
    }, [] as string[]) || [];

  // --- New: Filter projects based on selected lead ---
  const filteredProjects =
    selectedProjectLead && projectList
      ? projectList.filter((p: any) => p.lead?.name === selectedProjectLead)
      : projectList;

  // Additional Overview Info (Project stats)
  const totalProjects = projectList ? projectList.length : 0;
  const uniqueProjectLeads = projectLeads.length;
  const totalTickets = qualifiedData ? hoursData.length : 0;

  // Define the dashboard UI.
  const dashboardContent = (
    <>
      {/* Header with title, nav and dropdowns */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
        <div className="flex flex-col md:flex-row items-center gap-4">
          <h1 className="text-3xl font-bold text-slate-800 dark:text-white">
            Admin Dashboard
          </h1>
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
        <div className="flex items-center space-x-4">
          {/* Existing: Project Selection Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                className="px-4 py-2 flex items-center gap-2"
              >
                <Briefcase className="h-4 w-4" />
                {isLoading ? (
                  <Skeleton height={20} width={100} />
                ) : selectedProject && filteredProjects?.length ? (
                  filteredProjects.find((p: any) => p.key === selectedProject)
                    ?.name
                ) : (
                  "Select Project"
                )}
                <ChevronDown className="h-4 w-4 ml-1" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="end">
              <DropdownMenuLabel>Select a Project</DropdownMenuLabel>
              <DropdownMenuSeparator />
              {isLoading ? (
                <>
                  <DropdownMenuItem>
                    <Skeleton height={20} width={120} />
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Skeleton height={20} width={120} />
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Skeleton height={20} width={120} />
                  </DropdownMenuItem>
                </>
              ) : (
                filteredProjects?.map((project: any) => (
                  <DropdownMenuItem
                    key={project.id}
                    onClick={() => setSelectedProject(project.key)}
                  >
                    {project.name}
                  </DropdownMenuItem>
                ))
              )}
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
                  {userProfile &&
                  userProfile.user_metadata &&
                  userProfile.user_metadata.avatar_url ? (
                    <AvatarImage
                      src={userProfile.user_metadata.avatar_url}
                      alt={userProfile.email}
                    />
                  ) : (
                    <AvatarFallback>
                      {userProfile && userProfile.email
                        ? userProfile.email.charAt(0).toUpperCase()
                        : "AU"}
                    </AvatarFallback>
                  )}
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="end" forceMount>
              <DropdownMenuLabel className="font-normal">
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium">
                    {isLoading ? (
                      <Skeleton width={100} />
                    ) : userProfile && userProfile.email ? (
                      userProfile.email
                    ) : (
                      "Admin User"
                    )}
                  </p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <Settings className="mr-2 h-4 w-4" />
                <span>Settings</span>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => logout()}>
                <LogOut
                  className="mr-2 h-4 w-4"
                  onClick={() => {
                    console.log("Logging out...");
                    logout();
                  }}
                />
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

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="shadow-sm hover:shadow transition-shadow">
              <CardHeader>
                <CardTitle>Qualified Hours Overview</CardTitle>
                <CardDescription>
                  Summary based on the live data feed.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-6">
                  <div className="flex flex-col">
                    <span className="text-sm text-slate-500 dark:text-slate-400">
                      Total Qualified Hours
                    </span>
                    {isLoading ? (
                      <Skeleton height={40} width={80} />
                    ) : (
                      <span className="text-3xl font-bold">
                        {qualifiedTotalHours}
                      </span>
                    )}
                  </div>
                  <div className="flex flex-col">
                    <span className="text-sm text-slate-500 dark:text-slate-400">
                      Average Hourly Rate
                    </span>
                    {isLoading ? (
                      <Skeleton height={40} width={80} />
                    ) : (
                      <span className="text-3xl font-bold">
                        ${qualifiedAverageRate.toFixed(2)}
                      </span>
                    )}
                  </div>
                  <div className="flex flex-col">
                    <span className="text-sm text-slate-500 dark:text-slate-400">
                      Total Cost
                    </span>
                    {isLoading ? (
                      <Skeleton height={40} width={100} />
                    ) : (
                      <span className="text-3xl font-bold text-purple-700 dark:text-purple-400">
                        ${qualifiedGrandTotal.toLocaleString()}
                      </span>
                    )}
                  </div>
                  <div className="flex flex-col">
                    <span className="text-sm text-slate-500 dark:text-slate-400">
                      Priority Discount
                    </span>
                    {isLoading ? (
                      <Skeleton height={40} width={100} />
                    ) : (
                      <span className="text-3xl font-bold text-green-700 dark:text-green-400">
                        ${discountedTotal.toLocaleString()}
                      </span>
                    )}
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

            {/* New: Project Statistics Card */}
            <Card className="shadow-sm hover:shadow transition-shadow">
              <CardHeader>
                <CardTitle>Project Statistics</CardTitle>
                <CardDescription>
                  Overview of projects and tickets.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 gap-4">
                  <div className="flex flex-col">
                    <span className="text-sm text-slate-500 dark:text-slate-400">
                      Total Projects
                    </span>
                    {isLoading ? (
                      <Skeleton height={40} width={80} />
                    ) : (
                      <span className="text-3xl font-bold">
                        {totalProjects}
                      </span>
                    )}
                  </div>
                  <div className="flex flex-col">
                    <span className="text-sm text-slate-500 dark:text-slate-400">
                      Unique Project Leads
                    </span>
                    {isLoading ? (
                      <Skeleton height={40} width={80} />
                    ) : (
                      <span className="text-3xl font-bold">
                        {uniqueProjectLeads}
                      </span>
                    )}
                  </div>
                  <div className="flex flex-col">
                    <span className="text-sm text-slate-500 dark:text-slate-400">
                      Total Tickets
                    </span>
                    {isLoading ? (
                      <Skeleton height={40} width={80} />
                    ) : (
                      <span className="text-3xl font-bold">{totalTickets}</span>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Qualified Hours Tab */}
        <TabsContent value="qualified-hours" className="space-y-6">
          {/* Project Grand Total Card */}
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
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="flex flex-col">
                  <span className="text-sm text-slate-500 dark:text-slate-400">
                    Total Hours
                  </span>
                  {isLoading ? (
                    <Skeleton height={40} width={80} />
                  ) : (
                    <span className="text-3xl font-bold">
                      {qualifiedTotalHours}
                    </span>
                  )}
                </div>
                <div className="flex flex-col">
                  <span className="text-sm text-slate-500 dark:text-slate-400">
                    Average Hourly Rate
                  </span>
                  {isLoading ? (
                    <Skeleton height={40} width={80} />
                  ) : (
                    <span className="text-3xl font-bold">
                      ${qualifiedAverageRate.toFixed(2)}
                    </span>
                  )}
                </div>
                <div className="flex flex-col">
                  <span className="text-sm text-slate-500 dark:text-slate-400">
                    Total Cost
                  </span>
                  {isLoading ? (
                    <Skeleton height={40} width={100} />
                  ) : (
                    <span className="text-3xl font-bold text-purple-700 dark:text-purple-400">
                      ${qualifiedGrandTotal.toLocaleString()}
                    </span>
                  )}
                </div>
                <div className="flex flex-col">
                  <span className="text-sm text-slate-500 dark:text-slate-400">
                    Priority Discount
                  </span>
                  {isLoading ? (
                    <Skeleton height={40} width={100} />
                  ) : (
                    <span className="text-3xl font-bold text-green-700 dark:text-green-400">
                      ${discountedTotal.toLocaleString()}
                    </span>
                  )}
                </div>
              </div>
            </CardContent>
            <CardFooter className="border-t pt-4 flex justify-end">
              <div className="flex gap-2">
                <Badge
                  variant="outline"
                  className="bg-green-50 text-green-700 border-green-200"
                >
                  {isLoading ? (
                    <Skeleton width={30} />
                  ) : (
                    hoursData.filter((h: any) => h.status === "approved").length
                  )}{" "}
                  Approved
                </Badge>
                <Badge
                  variant="outline"
                  className="bg-amber-50 text-amber-700 border-amber-200"
                >
                  {isLoading ? (
                    <Skeleton width={30} />
                  ) : (
                    hoursData.filter((h: any) => h.status === "pending").length
                  )}{" "}
                  Pending
                </Badge>
                <Badge
                  variant="outline"
                  className="bg-red-50 text-red-700 border-red-200"
                >
                  {isLoading ? (
                    <Skeleton width={30} />
                  ) : (
                    hoursData.filter((h: any) => h.status === "denied").length
                  )}{" "}
                  Denied
                </Badge>
              </div>
            </CardFooter>
          </Card>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Hours per Category Card */}
            <Card className="shadow-sm hover:shadow transition-shadow">
              <CardHeader>
                <CardTitle>Hours per Category</CardTitle>
                <CardDescription>
                  Distribution of hours across categories.
                </CardDescription>
              </CardHeader>
              <CardContent className="flex justify-center">
                <div className="w-full" style={{ maxWidth: "300px" }}>
                  {isLoading ? (
                    <Skeleton height={300} />
                  ) : qualifiedData ? (
                    <Doughnut
                      options={chartOptions}
                      data={breakdownChartData}
                      width={300}
                      height={300}
                    />
                  ) : (
                    <p>Loading chart...</p>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Category Breakdown Card with Detailed View */}
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
                      {isLoading ? (
                        <Skeleton count={5} height={40} />
                      ) : qualifiedData ? (
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead>Category</TableHead>
                              <TableHead>Hours</TableHead>
                              <TableHead>Market Rate ($)</TableHead>
                              <TableHead>Cost</TableHead>
                              <TableHead>Priority Discount</TableHead>
                              <TableHead>% of Total</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {Object.keys(qualifiedData.breakdown).map(
                              (category) => {
                                const item = qualifiedData.breakdown[category];
                                const hours = item.totalHours;
                                const effectiveMarketRate =
                                  editableMarketRates[category] !== undefined
                                    ? editableMarketRates[category]
                                    : item.marketRate || 0;
                                const cost = hours * effectiveMarketRate;
                                const discountedCost = cost * 0.7;
                                const totalChartHours = Object.values(
                                  qualifiedData.breakdown
                                ).reduce(
                                  (a: number, b: any) => a + b.totalHours,
                                  0
                                );
                                const percentage = totalChartHours
                                  ? Math.round((hours / totalChartHours) * 100)
                                  : 0;
                                return (
                                  <TableRow key={category}>
                                    <TableCell className="font-medium">
                                      {category}
                                    </TableCell>
                                    <TableCell>{hours}</TableCell>
                                    <TableCell>
                                      <Input
                                        type="number"
                                        value={effectiveMarketRate}
                                        onChange={(e) =>
                                          handleMarketRateChange(
                                            category,
                                            Number(e.target.value)
                                          )
                                        }
                                      />
                                    </TableCell>
                                    <TableCell>
                                      ${cost.toLocaleString()}
                                    </TableCell>
                                    <TableCell>
                                      ${discountedCost.toLocaleString()}
                                    </TableCell>
                                    <TableCell>{percentage}%</TableCell>
                                  </TableRow>
                                );
                              }
                            )}
                          </TableBody>
                        </Table>
                      ) : null}
                    </div>
                  </SheetContent>
                </Sheet>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <Skeleton count={5} height={40} />
                ) : qualifiedData ? (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Category</TableHead>
                        <TableHead>Hours</TableHead>
                        <TableHead>Market Rate ($)</TableHead>
                        <TableHead>Cost</TableHead>
                        <TableHead>Priority Discount</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {Object.keys(qualifiedData.breakdown).map((category) => {
                        const item = qualifiedData.breakdown[category];
                        const hours = item.totalHours;
                        const effectiveMarketRate =
                          editableMarketRates[category] !== undefined
                            ? editableMarketRates[category]
                            : item.marketRate || 0;
                        const cost = hours * effectiveMarketRate;
                        const discountedCost = cost * 0.7;
                        return (
                          <TableRow key={category}>
                            <TableCell className="font-medium">
                              {category}
                            </TableCell>
                            <TableCell>{hours}</TableCell>
                            <TableCell>
                              <Input
                                type="number"
                                value={effectiveMarketRate}
                                onChange={(e) =>
                                  handleMarketRateChange(
                                    category,
                                    Number(e.target.value)
                                  )
                                }
                              />
                            </TableCell>
                            <TableCell>${cost.toLocaleString()}</TableCell>
                            <TableCell>
                              ${discountedCost.toLocaleString()}
                            </TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                ) : null}
              </CardContent>
            </Card>
          </div>

          {/* Qualified Hours Report Card with Detailed View */}
          <Card className="shadow-sm hover:shadow transition-shadow">
            <CardHeader>
              <CardTitle>Qualified Hours Report</CardTitle>
              <CardDescription>
                Breakdown of hours, market rates, total cost, and assignees.
              </CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <Skeleton count={5} height={40} />
              ) : qualifiedData ? (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Category</TableHead>
                      <TableHead>Total Hours</TableHead>
                      <TableHead>Market Rate ($)</TableHead>
                      <TableHead>Total Cost</TableHead>
                      <TableHead>Priority Discount</TableHead>
                      <TableHead>Assignees</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {Object.entries(qualifiedData.breakdown).map(
                      ([category, data]: [string, any]) => {
                        const effectiveMarketRate =
                          editableMarketRates[category] !== undefined
                            ? editableMarketRates[category]
                            : data.marketRate || 0;
                        const totalCost = data.totalHours * effectiveMarketRate;
                        const discountedCost = totalCost * 0.7;
                        const assignees = Object.entries(data.assignees)
                          .map(([name, hrs]) => `${name} (${hrs})`)
                          .join(", ");
                        return (
                          <TableRow key={category}>
                            <TableCell className="font-medium">
                              {category}
                            </TableCell>
                            <TableCell>{data.totalHours}</TableCell>
                            <TableCell>
                              <Input
                                type="number"
                                value={effectiveMarketRate}
                                onChange={(e) =>
                                  handleMarketRateChange(
                                    category,
                                    Number(e.target.value)
                                  )
                                }
                              />
                            </TableCell>
                            <TableCell>${totalCost.toLocaleString()}</TableCell>
                            <TableCell>
                              ${discountedCost.toLocaleString()}
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
    </>
  );

  if (user === undefined) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50 dark:bg-slate-900">
        <p className="text-xl">Loading...</p>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-slate-50 dark:bg-slate-900">
      <main className="flex-1 p-6 md:p-8 lg:p-12">
        {user ? dashboardContent : <Login />}
      </main>
    </div>
  );
}
