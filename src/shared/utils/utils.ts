import type { Exam } from '../dtos';

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
  return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
};

// Helper function to calculate exam score percentage
export const calculatePercentage = (score: number, maxScore: number): string => {
  return ((score / maxScore) * 100).toFixed(1);
};