export interface Submission {
  submission_id: string;
  exam_id: string;
  user_id: string;
  submitted_at: string;
  total_score: number;
  cheated?: boolean;
  status: 'submitted' | 'graded';
  user?: {
    full_name?: string;
    username: string;
    email?: string;
  };
}

export interface Answer {
  answer_id: string;
  submission_id: string;
  question_id: string;
  answer_text?: string;
  selected_choices?: string[];
  score?: number;
  graded_by?: string;
  graded_at?: string;
}

export interface CreateAnswerDto {
  question_id: string;
  answer_text?: string;
  selected_choices?: string[];
}

export interface CreateSubmissionDto {
  exam_id: string;
  answers: CreateAnswerDto[];
}

export interface GradeAnswerDto {
  answer_id: string;
  score: number;
}
