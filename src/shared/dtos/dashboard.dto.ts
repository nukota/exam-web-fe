export interface DashboardDTO {
  total_exams: number;
  total_students: number;
  pending_grading: number;
  avg_score: string;
  // The chart shows latest 30 days of data with 3-day intervals
  exam_scores_data: {
    date?: string;
    avg_score?: number;
  }[];
  exam_type_data: {
    name?: string;
    value?: number;
  }[];
  top_exams_data: {
    exam?: string;
    submissions?: number;
  }[];
  // The chart shows latest 30 days of data with 3-day intervals
  student_activity_data: {
    date?: string;
    students?: number;
  }[];
}
