/**
 * Format a date object to a human-readable string
 * @param date - The date to format
 * @returns Formatted string in "MMM DD, YYYY" format (e.g., "Oct 01, 2025")
 */
export function formatDate(date: Date): string {
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: '2-digit'
  }).format(date);
}
