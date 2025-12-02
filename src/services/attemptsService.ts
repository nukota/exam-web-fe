import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "../shared/lib/apiClient";
import { queryKeys } from "../shared/lib/queryKeys";
import { auth } from "../shared/lib/firebase";
import type {
  Attempt,
  SubmitExamDTO,
  MyResultsPageDTO,
  ExamResultPageDTO,
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
      // Invalidate attempts and results to refetch updated status
      queryClient.invalidateQueries({
        queryKey: queryKeys.attempts.all,
      });
      queryClient.invalidateQueries({
        queryKey: queryKeys.results.all,
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
