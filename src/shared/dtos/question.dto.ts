export interface Question {
  question_id: string;
  exam_id: string;
  question_text: string;
  question_type: 'essay' | 'single_choice' | 'multiple_choice' | 'short_answer' | 'coding';
  points: number;
  correct_answer?: string[];
  coding_template?: string;
  image_url?: string;
  choices?: Choice[];
  test_cases?: CodingTestCase[];
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

export interface CreateQuestionDto {
  exam_id: string;
  question_text: string;
  question_type: 'essay' | 'single_choice' | 'multiple_choice' | 'short_answer' | 'coding';
  points: number;
  correct_answer?: string[];
  coding_template?: string;
  image_url?: string;
  choices?: Omit<Choice, 'choice_id' | 'question_id'>[];
  test_cases?: Omit<CodingTestCase, 'test_case_id' | 'question_id'>[];
}
