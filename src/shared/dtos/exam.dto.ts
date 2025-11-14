export interface Exam {
  exam_id: string;
  teacher_id: string;
  title: string;
  description?: string;
  type: 'essay' | 'multiple_choice' | 'coding';
  access_code: string;
  start_at?: string;
  end_at?: string;
  created_at?: string;
  duration_minutes?: number;
}

export interface CreateExamDto {
  title: string;
  description?: string;
  type: 'essay' | 'multiple_choice' | 'coding';
  access_code: string;
  start_at?: string;
  end_at?: string;
  duration_minutes?: number;
}

export interface UpdateExamDto {
  title?: string;
  description?: string;
  type?: 'essay' | 'multiple_choice' | 'coding';
  access_code?: string;
  start_at?: string;
  end_at?: string;
  duration_minutes?: number;
}
