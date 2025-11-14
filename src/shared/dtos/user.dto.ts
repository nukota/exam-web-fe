export interface User {
  user_id: string;
  username: string;
  full_name?: string;
  email?: string;
  role: 'student' | 'teacher' | 'admin';
  dob?: string;
  class_name?: string;
  school_name?: string;
  created_at?: string;
}

export interface CreateUserDto {
  username: string;
  password: string;
  full_name?: string;
  email?: string;
  role: 'student' | 'teacher' | 'admin';
  dob?: string;
  class_name?: string;
  school_name?: string;
}
