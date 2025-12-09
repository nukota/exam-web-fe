import type { QuestionType, ProgrammingLanguage } from "../enum";
import type { Choice, ReviewChoiceDTO, UpdateChoiceDTO } from "./choice.dto";
import type {
  CodingTestCase,
  UpdatingCodingTestCaseDTO,
} from "./coding-test-cases.dto";

export interface Question {
  question_id: string;
  exam_id: string;
  question_text: string;
  title?: string;
  order: number;
  question_type: QuestionType;
  points: number;
  correct_answer?: string[]; // for multiple_choice and single_choice questions
  correct_answer_text?: string[]; // for short_answer questions
  coding_template?: Record<string, string>;
  programming_languages?: ProgrammingLanguage[];
}

export interface QuestionDTO extends Question {
  choices?: Omit<Choice, "question_id">[];
  coding_test_cases?: Omit<CodingTestCase, "question_id">[];
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
  coding_test_cases?: UpdatingCodingTestCaseDTO[];
}

export interface ReviewQuestionDTO extends Question {
  answer_text?: string;
  selected_choices?: string[];
  score?: number;
  choices?: ReviewChoiceDTO[];
  is_flagged?: boolean;
  answered_correctly?: boolean;
  programming_language?: ProgrammingLanguage;
  // Only Standard type questions are reviewed, no Coding type questions
}
