import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "../shared/lib/apiClient";
import { queryKeys } from "../shared/lib/queryKeys";
import { auth } from "../shared/lib/firebase";
import type { Attempt } from "../shared/dtos/attempt.dto";

const joinExam = async (accessCode: string): Promise<Attempt> => {
  if (!auth.currentUser) throw new Error("Not authenticated");
  return api.post<Attempt>(`/attempts/join/${accessCode}`, {});
};

const leaveExam = async (examId: string): Promise<void> => {
  if (!auth.currentUser) throw new Error("Not authenticated");
  return api.delete<void>(`/attempts/leave/${examId}`);
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
