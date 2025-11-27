import type { AttemptStatus } from "../enum";
import type { ReviewQuestionDTO } from "./question.dto";

export interface Attempt {
  attempt_id: string;
  exam_id: string;
  user_id: string;
  started_at?: string;
  submitted_at?: string;
  created_at: string;
  updated_at: string;
  total_score?: number;
  cheated: boolean;
  status: AttemptStatus;
}

export interface ExamAttemptsPageItemDTO {
  attempt_id: string;
  student: {
    user_id: string;
    full_name?: string;
    email?: string;
  };
  submitted_at?: string;
  percentage_score?: number;
  total_score?: number;
  cheated: boolean;
  status: AttemptStatus;
}

// DTO for the Exam Attempts Page
export interface ExamAttemptsPageDTO {
  exam_id: string;
  title: string;
  description?: string;
  max_score: number;
  total_attempts: number;
  graded_attempts: number;
  flagged_attempts: number;
  attempts: ExamAttemptsPageItemDTO[];
}

export interface SubmissionReviewPageDTO {
  student: {
    user_id: string;
    full_name?: string;
    email?: string;
  };
  exam: {
    exam_id: string;
    title: string;
    max_score: number;
  };
  total_score?: number;
  submitted_at?: string;
  questions: ReviewQuestionDTO[];
}
