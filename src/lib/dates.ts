export function formatDateRange(startDate: string, endDate?: string): string {
  const format = (value: string) =>
    new Date(`${value}T00:00:00`).toLocaleDateString("en-US", {
      month: "short",
      year: "numeric",
    });

  return endDate
    ? `${format(startDate)} to ${format(endDate)}`
    : `${format(startDate)} to Present`;
}
