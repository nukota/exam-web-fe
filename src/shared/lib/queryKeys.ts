/**
 * Query keys for React Query
 * Organize query keys in a hierarchical structure for better cache management
 */

export const queryKeys = {
  auth: {
    all: ["auth"] as const,
    currentUser: ["auth", "currentUser"] as const,
  },
  exams: {
    all: ["exams"] as const,
    list: (filters?: Record<string, unknown>) =>
      ["exams", "list", filters] as const,
    detail: (id: string) => ["exams", "detail", id] as const,
    attempts: (examId: string) => ["exams", "attempts", examId] as const,
  },
  users: {
    all: ["users"] as const,
    list: (filters?: Record<string, unknown>) =>
      ["users", "list", filters] as const,
    detail: (id: string) => ["users", "detail", id] as const,
    students: ["users", "students"] as const,
  },
  submissions: {
    all: ["submissions"] as const,
    list: (filters?: Record<string, unknown>) =>
      ["submissions", "list", filters] as const,
    detail: (id: string) => ["submissions", "detail", id] as const,
  },
} as const;

// Helper function to invalidate related queries
export const getInvalidationKeys = {
  auth: () => [queryKeys.auth.all],
  exams: () => [queryKeys.exams.all],
  users: () => [queryKeys.users.all],
  submissions: () => [queryKeys.submissions.all],
};
