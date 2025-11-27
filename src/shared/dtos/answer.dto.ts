export interface Answer {
  answer_id: string;
  attempt_id: string;
  question_id: string;
  answer_text?: string;
  selected_choices?: string[];
  score?: number;
  graded_by?: string;
  graded_at?: string;
}

export interface SubmitAnswerDTO {
  question_id: string;
  answer_text?: string;
  selected_choices?: string[];
}

// DTO for submitting answers for an exam attempt
export interface SubmitExamDTO {
  attempt_id: string;
  answers: SubmitAnswerDTO[];
}
