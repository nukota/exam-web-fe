import type { QuestionType, ProgrammingLanguage } from "../enum";
import type { Exam } from "./exam.dto";
import type { Answer } from "./answer.dto";

export interface Question {
  question_id: string;
  exam_id: string;
  question_text: string;
  title?: string;
  order: number;
  question_type: QuestionType;
  points: number;
  correct_answer?: string[];
  correct_answer_text?: string[];
  coding_template?: Record<string, string>;
  programming_languages?: ProgrammingLanguage[];
  image_url?: string;
  exam?: Exam;
  choices?: Choice[];
  codingTestCases?: CodingTestCase[];
  answers?: Answer[];
  flags?: Flag[];
}

export interface Choice {
  choice_id: string;
  question_id: string;
  choice_text: string;
  is_correct: boolean;
}

export interface CodingTestCase {
  test_case_id: string;
  question_id: string;
  input_data: string;
  expected_output: string;
  is_hidden: boolean;
}

export interface Flag {
  flag_id: string;
  question_id: string;
  submission_id: string;
  reason: string;
  flagged_at: string;
}

export interface CreateQuestionDto {
  exam_id: string;
  question_text?: string;
  title?: string;
  order: number;
  question_type: QuestionType;
  points: number;
  correct_answer?: string[];
  correct_answer_text?: string[];
  coding_template?: Record<string, string>;
  programming_languages?: ProgrammingLanguage[];
  image_url?: string;
  choices?: Omit<Choice, "choice_id" | "question_id">[];
  codingTestCases?: Omit<CodingTestCase, "test_case_id" | "question_id">[];
}
