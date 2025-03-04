/**
 * Retrieves the time breakdown for a project based on qualified hours type,
 * along with the breakdown by assignee and the market rate for each type.
 *
 * @returns {Promise<{ breakdown: Record<string, { totalHours: number, marketRate: number, assignees: Record<string, number> }>, grandTotal: number }>}
 */
export async function getQualifiedHoursBreakdown() {
	try {
		// Fetch data from the /api/time endpoint.
		const response = await fetch("/api/time");
		if (!response.ok) {
			throw new Error("Failed to fetch time data");
		}
		const tickets = await response.json();

		// Filter out tickets with a null "Qualified Hours Type".
		const validTickets = tickets.issues.filter(
			(ticket: any) => ticket.fields["Qualified Hours Type"]
		);

		// Example mapping for market rates by type.
		// Adjust this mapping as needed or retrieve it from another source.
		const marketRatesMapping = {
			Testing: 100,
			Development: 120,
			Prototyping: 120,
			Documentation: 100,
			// Add additional types and rates here...
		} as any;

		// Initialize breakdown object and grand total variable.
		const breakdown = {} as any;
		let grandTotal = 0;

		validTickets.forEach((ticket: any) => {
			// Calculate the time spent in hours.
			const timeSpentSeconds =
				(ticket.fields.timetracking &&
					ticket.fields.timetracking.timeSpentSeconds) ||
				ticket.fields.timespent ||
				0;
			const hours = timeSpentSeconds / 3600;

			// Get the qualified hours type.
			const type = ticket.fields["Qualified Hours Type"];

			// Determine the assignee.
			// Depending on your API, you might need to adjust how you extract the name.
			const assignee = ticket.fields.assignee
				? ticket.fields.assignee.displayName || ticket.fields.assignee.name
				: "Unassigned";

			// Initialize the type entry if it doesn't exist.
			if (!breakdown[type]) {
				breakdown[type] = {
					totalHours: 0,
					// Get the market rate from the mapping, or default to 0.
					marketRate: marketRatesMapping[type] || 0,
					assignees: {},
				};
			}

			// Add the hours to the total for this type.
			breakdown[type].totalHours += hours;
			grandTotal += hours;

			// Sum the hours for the specific assignee within the type.
			if (!breakdown[type].assignees[assignee]) {
				breakdown[type].assignees[assignee] = 0;
			}
			breakdown[type].assignees[assignee] += hours;
		});

		// Optionally, round all hours to two decimal places.
		Object.keys(breakdown).forEach((type) => {
			breakdown[type].totalHours =
				Math.round(breakdown[type].totalHours * 100) / 100;
			Object.keys(breakdown[type].assignees).forEach((assignee) => {
				breakdown[type].assignees[assignee] =
					Math.round(breakdown[type].assignees[assignee] * 100) / 100;
			});
		});
		grandTotal = Math.round(grandTotal * 100) / 100;

		return { breakdown, grandTotal };
	} catch (error) {
		console.error("Error fetching or processing time breakdown:", error);
		throw error;
	}
}
