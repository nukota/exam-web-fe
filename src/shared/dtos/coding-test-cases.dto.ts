export interface CodingTestCase {
  test_case_id: string;
  question_id: string;
  input_data: string;
  expected_output: string;
  is_hidden: boolean;
}

export interface UpdatingCodingTestCaseDTO {
  test_case_id: string; // Temp ID for new test cases (format: 'temp_<uuid>'), or real UUID for existing test cases
  input_data: string;
  expected_output: string;
  is_hidden: boolean;
}
