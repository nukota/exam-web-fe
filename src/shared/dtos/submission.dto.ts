import type { CreateAnswerDto } from "./answer.dto";

export interface Submission {
  submission_id: string;
  exam_id: string;
  user_id: string;
  submitted_at: string;
  total_score: number;
  cheated?: boolean;
  status: "submitted" | "graded";
  user?: {
    full_name?: string;
    username: string;
    email?: string;
  };
}

export interface CreateSubmissionDto {
  exam_id: string;
  answers: CreateAnswerDto[];
}
