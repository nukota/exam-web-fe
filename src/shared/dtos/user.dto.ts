import type { UserRole } from "../enum";

export interface User {
  user_id: string;
  username: string;
  full_name?: string;
  email?: string;
  photo_url?: string;
  role: UserRole;
  dob?: string;
  class_name?: string;
  school_name?: string;
  created_at?: string;
}
