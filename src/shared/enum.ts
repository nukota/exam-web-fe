export type UserRole = "admin" | "student";

export type ExamType = "standard" | "coding";

// not in database
export type ExamStatus =
  | "not started"
  | "started"
  | "ended"
  | "graded"
  | "released";

export type QuestionType =
  | "essay"
  | "single_choice"
  | "multiple_choice"
  | "short_answer"
  | "coding";

export type ProgrammingLanguage = "c++" | "python" | "javascript" | "java";

export type AttemptStatus =
  | "not_started"
  | "in_progress"
  | "submitted"
  | "overdue"
  | "graded"
  | "cancelled";
