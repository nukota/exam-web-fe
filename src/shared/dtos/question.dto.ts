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
}

export interface CodingTestCase {
  test_case_id: string;
  question_id: string;
  input_data: string;
  expected_output: string;
  is_hidden: boolean;
}

export interface QuestionDTO {
  question_id: string;
  question_text: string;
  title?: string;
  order: number;
  question_type: string;
  points: number;
  correct_answer?: string[];
  correct_answer_text?: string[];
  coding_template?: Record<string, string>;
  programming_languages?: ProgrammingLanguage[];
  choices?: Omit<Choice, "choice_id" | "question_id">[];
  codingTestCases?: Omit<CodingTestCase, "test_case_id" | "question_id">[];
}

export interface UpdateChoiceDTO {
  choice_id: string; // Temp ID for new choices (format: 'temp_<uuid>'), or real UUID for existing choices
  choice_text: string;
}

export interface UpdatingCodingTestCaseDTO {
  test_case_id: string; // Temp ID for new test cases (format: 'temp_<uuid>'), or real UUID for existing test cases
  input_data: string;
  expected_output: string;
  is_hidden: boolean;
}

export interface UpdateQuestionDTO {
  question_id?: string | null; // null = create new, string = update existing
  question_text: string;
  title?: string;
  order: number;
  question_type: string;
  points?: number;
  correct_answer?: string[]; // Array of choice_ids (can be temp IDs like 'temp_uuid' or real IDs)
  correct_answer_text?: string[];
  coding_template?: Record<string, string>;
  programming_languages?: ProgrammingLanguage[];
  choices?: UpdateChoiceDTO[];
  codingTestCases?: UpdatingCodingTestCaseDTO[];
}

export interface Flag {
  user_id: string;
  question_id: string;
  flagged_at: string;
}
