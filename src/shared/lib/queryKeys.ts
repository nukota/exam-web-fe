/**
 * Query keys for React Query
 * Organize query keys in a hierarchical structure for better cache management
 */

export const queryKeys = {
  auth: {
    all: ["auth"] as const,
    currentUser: ["auth", "currentUser"] as const,
  },
  dashboard: {
    all: ["dashboard"] as const,
  },
  exams: {
    all: ["exams"] as const,
    list: (filters?: Record<string, unknown>) =>
      ["exams", "list", filters] as const,
    detail: (id: string) => ["exams", "detail", id] as const,
    attempts: (examId: string) => ["exams", "attempts", examId] as const,
  },
  attempts: {
    all: ["attempts"] as const,
    exam: (examId: string) => ["attempts", "exam", examId] as const,
  },
  results: {
    all: ["results"] as const,
    leaderboard: (examId: string) =>
      ["results", "leaderboard", examId] as const,
    adminLeaderboard: (examId: string) =>
      ["results", "adminLeaderboard", examId] as const,
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
  dashboard: () => [queryKeys.dashboard.all],
  exams: () => [queryKeys.exams.all],
  attempts: () => [queryKeys.attempts.all],
  results: () => [queryKeys.results.all],
  users: () => [queryKeys.users.all],
  submissions: () => [queryKeys.submissions.all],
};
