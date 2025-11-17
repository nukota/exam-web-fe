export interface Exam {
  exam_id: string;
  teacher_id: string;
  title: string;
  description?: string;
  type: 'standard' | 'coding';
  access_code: string;
  start_at?: string;
  end_at?: string;
  created_at?: string;
  duration_minutes?: number;
}

export interface CreateExamDto {
  teacher_id: string;
  title: string;
  description?: string;
  type: 'standard' | 'coding';
  access_code: string;
  start_at?: string;
  end_at?: string;
  duration_minutes?: number;
}

export type UpdateExamDto = Partial<CreateExamDto>;
