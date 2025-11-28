import type { ExamStatus, ExamType } from "../enum";
import type { QuestionDTO, UpdateQuestionDTO } from "./question.dto";

export interface Exam {
  exam_id: string;
  teacher_id: string;
  title: string;
  description?: string;
  type: ExamType;
  access_code: string;
  start_at?: string;
  end_at: string;
  created_at: string;
  duration_minutes?: number;
  results_released?: boolean;
}

// DTO for creating a new exam (no questions)
export interface CreateExamDTO {
  title: string;
  description?: string;
  type: ExamType;
  start_at?: string;
  end_at: string;
  duration_minutes?: number;
}

export interface AllExamsPageItemDTO extends Exam {
  question_amount: number;
  status: ExamStatus;
}

// DTO for the All Exams Page
export type AllExamsPageDTO = AllExamsPageItemDTO[];

// DTO for updating an exam with detailed questions
export interface UpdateExamWithQuestionsDTO extends Partial<CreateExamDTO> {
  questions: UpdateQuestionDTO[]; // Array of questions with null IDs for new, non-null for updates. Missing IDs will be deleted.
}

export interface GradingPageItemDTO {
  exam_id: string;
  title: string;
  description?: string;
  end_at: string;
  total_submissions: number;
  pending_submissions: number;
  teacher_name: string;
  teacher_email: string;
}

// DTO for the Grading Page
export type GradingPageDTO = GradingPageItemDTO[];

// DTO for Exam Taking Page and Exam Editing Page
export interface ExamTakingPageDTO extends Exam {
  questions: QuestionDTO[];
}
