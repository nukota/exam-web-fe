import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "../shared/lib/apiClient";
import { queryKeys } from "../shared/lib/queryKeys";
import { auth } from "../shared/lib/firebase";
import type {
  Attempt,
  SubmitExamDTO,
  MyResultsPageDTO,
  ExamResultPageDTO,
  ExamAttemptsPageDTO,
  SubmissionReviewPageDTO,
  GradeEssayDTO,
  ExamLeaderboardPageDTO,
} from "../shared/dtos/attempt.dto";

const joinExam = async (accessCode: string): Promise<Attempt> => {
  if (!auth.currentUser) throw new Error("Not authenticated");
  return api.post<Attempt>(`/attempts/join/${accessCode}`, {});
};

const leaveExam = async (examId: string): Promise<void> => {
  if (!auth.currentUser) throw new Error("Not authenticated");
  return api.delete<void>(`/attempts/leave/${examId}`);
};

const submitExam = async ({
  examId,
  submitData,
}: {
  examId: string;
  submitData: SubmitExamDTO;
}): Promise<void> => {
  if (!auth.currentUser) throw new Error("Not authenticated");
  return api.post<void>(`/attempts/submit/${examId}`, submitData);
};

const getMyResults = async (): Promise<MyResultsPageDTO> => {
  if (!auth.currentUser) throw new Error("Not authenticated");
  return api.get<MyResultsPageDTO>("/attempts/result");
};

const getExamLeaderboard = async (
  examId: string
): Promise<ExamResultPageDTO> => {
  if (!auth.currentUser) throw new Error("Not authenticated");
  return api.get<ExamResultPageDTO>(`/attempts/leaderboard/${examId}`);
};

const getExamAttempts = async (
  examId: string
): Promise<ExamAttemptsPageDTO> => {
  if (!auth.currentUser) throw new Error("Not authenticated");
  return api.get<ExamAttemptsPageDTO>(`/attempts/exam/${examId}`);
};

const getAdminExamLeaderboard = async (
  examId: string
): Promise<ExamLeaderboardPageDTO> => {
  if (!auth.currentUser) throw new Error("Not authenticated");
  return api.get<ExamLeaderboardPageDTO>(
    `/attempts/leaderboard/admin/${examId}`
  );
};

const getSubmissionReview = async (
  attemptId: string
): Promise<SubmissionReviewPageDTO> => {
  if (!auth.currentUser) throw new Error("Not authenticated");
  return api.get<SubmissionReviewPageDTO>(`/attempts/review/${attemptId}`);
};

const gradeSubmission = async ({
  attemptId,
  gradeData,
}: {
  attemptId: string;
  gradeData: GradeEssayDTO;
}): Promise<void> => {
  if (!auth.currentUser) throw new Error("Not authenticated");
  return api.post<void>(`/attempts/grade/${attemptId}`, gradeData);
};

const deleteAttempt = async (attemptId: string): Promise<void> => {
  if (!auth.currentUser) throw new Error("Not authenticated");
  return api.delete<void>(`/attempts/${attemptId}`);
};

const cancelResult = async (attemptId: string): Promise<void> => {
  if (!auth.currentUser) throw new Error("Not authenticated");
  return api.post<void>(`/attempts/cancel-result/${attemptId}`, {});
};

// React Query Hooks
export const useJoinExam = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: joinExam,
    onSuccess: () => {
      // Invalidate exams list to refetch and show updated join status
      queryClient.invalidateQueries({
        queryKey: queryKeys.exams.all,
      });
    },
  });
};

export const useLeaveExam = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: leaveExam,
    onSuccess: () => {
      // Invalidate exams list to refetch and show updated join status
      queryClient.invalidateQueries({
        queryKey: queryKeys.exams.all,
      });
    },
  });
};

export const useSubmitExam = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: submitExam,
    onSuccess: () => {
      // Invalidate attempts, results, and exams to refetch updated status
      queryClient.invalidateQueries({
        queryKey: queryKeys.attempts.all,
      });
      queryClient.invalidateQueries({
        queryKey: queryKeys.results.all,
      });
      queryClient.invalidateQueries({
        queryKey: queryKeys.exams.all,
      });
    },
  });
};

export const useMyResults = () => {
  return useQuery({
    queryKey: queryKeys.results.all,
    queryFn: getMyResults,
  });
};

export const useExamLeaderboard = (examId: string) => {
  return useQuery({
    queryKey: queryKeys.results.leaderboard(examId),
    queryFn: () => getExamLeaderboard(examId),
    enabled: !!examId,
  });
};

export const useExamAttempts = (examId: string) => {
  return useQuery({
    queryKey: queryKeys.attempts.exam(examId),
    queryFn: () => getExamAttempts(examId),
    enabled: !!examId,
  });
};

export const useAdminExamLeaderboard = (examId: string) => {
  return useQuery({
    queryKey: queryKeys.results.adminLeaderboard(examId),
    queryFn: () => getAdminExamLeaderboard(examId),
    enabled: !!examId,
  });
};

export const useSubmissionReview = (attemptId: string) => {
  return useQuery({
    queryKey: queryKeys.submissions.detail(attemptId),
    queryFn: () => getSubmissionReview(attemptId),
    enabled: !!attemptId,
  });
};

export const useGradeSubmission = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: gradeSubmission,
    onSuccess: (_, variables) => {
      // Invalidate submission details, attempts list, and exams for grading
      queryClient.invalidateQueries({
        queryKey: queryKeys.submissions.detail(variables.attemptId),
      });
      queryClient.invalidateQueries({
        queryKey: queryKeys.attempts.all,
      });
      queryClient.invalidateQueries({
        queryKey: queryKeys.exams.all,
      });
    },
  });
};

export const useDeleteAttempt = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteAttempt,
    onSuccess: () => {
      // Invalidate attempts and results to refetch updated data
      queryClient.invalidateQueries({
        queryKey: queryKeys.attempts.all,
      });
      queryClient.invalidateQueries({
        queryKey: queryKeys.results.all,
      });
    },
  });
};

export const useCancelResult = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: cancelResult,
    onSuccess: () => {
      // Invalidate attempts and results to refetch updated data
      queryClient.invalidateQueries({
        queryKey: queryKeys.attempts.all,
      });
      queryClient.invalidateQueries({
        queryKey: queryKeys.results.all,
      });
    },
  });
};
