import type { Exam } from "../dtos";

// Helper function to check if exam is currently active
export const isExamActive = (exam: Exam): boolean => {
  const now = new Date();
  const start = exam.start_at ? new Date(exam.start_at) : null;
  const end = exam.end_at ? new Date(exam.end_at) : null;

  if (!start || !end) return true;
  return now >= start && now <= end;
};

// Helper function to format time remaining
export const formatTimeRemaining = (seconds: number): string => {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;
  return `${hours.toString().padStart(2, "0")}:${minutes
    .toString()
    .padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
};

// Helper function to calculate percentage
export const calculatePercentage = (value: number, total: number): number => {
  if (total === 0) return 0;
  return Math.round((value / total) * 100);
};

// Helper function to format exam date range
export const formatExamDateRange = (
  startDate?: Date | string | null,
  endDate?: Date | string | null
): string => {
  if (!startDate) return "N/A";

  const start = new Date(startDate);
  const end = endDate ? new Date(endDate) : null;

  const formatDateWithYear = (date: Date) => {
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const formatDateWithoutYear = (date: Date) => {
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    });
  };

  if (!end) {
    return formatDateWithYear(start);
  }

  // If same date, show single date with year
  if (start.toDateString() === end.toDateString()) {
    return formatDateWithYear(start);
  }

  // Different dates, show range - start without year, end with year
  return `${formatDateWithoutYear(start)} - ${formatDateWithYear(end)}`;
};
