import type { AttemptStatus, ExamStatus, ExamType } from "../enum";
import type { Question, CreateQuestionDto } from "./question.dto";

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

export interface CreateExamDto {
  teacher_id: string;
  title: string;
  description?: string;
  type: "standard" | "coding";
  access_code: string;
  start_at?: string;
  end_at?: string;
  duration_minutes?: number;
}

export type UpdateExamDto = Partial<CreateExamDto>;

export interface AllExamsPageItemDTO extends Exam {
  question_amount: number;
  status: ExamStatus;
}

export type AllExamsPageDTO = AllExamsPageItemDTO[];

export interface EditExamPageDTO {
  exam: Exam;
  questions: Question[];
}

export interface UpdateExamWithQuestionsDto {
  exam: UpdateExamDto;
  questions: {
    create?: Omit<CreateQuestionDto, "exam_id">[];
    update?: (Partial<Omit<CreateQuestionDto, "exam_id">> & {
      question_id: string;
    })[];
    delete?: string[]; // question_ids to delete
  };
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

export type GradingPageDTO = GradingPageItemDTO[];

export interface ExamAttemptItemDTO {
  attempt_id: string;
  student_name: string;
  student_email: string;
  submitted_at: string;
  score: number;
  status: AttemptStatus;
  cheated: boolean;
}

export interface ExamAttemptsPageDTO {
  exam_id: string;
  exam_title: string;
  max_score: number;
  attempts: ExamAttemptItemDTO[];
}
