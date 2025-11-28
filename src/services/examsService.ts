import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "../shared/lib/apiClient";
import { queryKeys } from "../shared/lib/queryKeys";
import { auth } from "../shared/lib/firebase";
import type {
  AllExamsPageDTO,
  ExamTakingPageDTO,
  CreateExamDTO,
  UpdateExamWithQuestionsDTO,
  Exam,
} from "../shared/dtos/exam.dto";

const getAllExams = async (): Promise<AllExamsPageDTO> => {
  if (!auth.currentUser) throw new Error("Not authenticated");
  return api.get<AllExamsPageDTO>("/exams/all");
};

const getExamById = async (examId: string): Promise<ExamTakingPageDTO> => {
  if (!auth.currentUser) throw new Error("Not authenticated");
  return api.get<ExamTakingPageDTO>(`/exams/${examId}`);
};

const createExam = async (data: CreateExamDTO): Promise<Exam> => {
  if (!auth.currentUser) throw new Error("Not authenticated");
  return api.post<Exam>("/exams", data);
};

const updateExam = async ({
  examId,
  data,
}: {
  examId: string;
  data: UpdateExamWithQuestionsDTO;
}): Promise<Exam> => {
  if (!auth.currentUser) throw new Error("Not authenticated");
  return api.patch<Exam>(`/exams/${examId}`, data);
};

const deleteExam = async (examId: string): Promise<void> => {
  if (!auth.currentUser) throw new Error("Not authenticated");
  return api.delete<void>(`/exams/${examId}`);
};

// React Query Hooks
export const useExams = (enabled: boolean = true) => {
  return useQuery({
    queryKey: queryKeys.exams.list(),
    queryFn: getAllExams,
    enabled: enabled && !!auth.currentUser,
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
};

export const useExam = (examId: string, enabled: boolean = true) => {
  return useQuery({
    queryKey: queryKeys.exams.detail(examId),
    queryFn: () => getExamById(examId),
    enabled: enabled && !!examId && !!auth.currentUser,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const useCreateExam = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createExam,
    onSuccess: () => {
      // Invalidate exams list to refetch
      queryClient.invalidateQueries({
        queryKey: queryKeys.exams.all,
      });
    },
  });
};

export const useUpdateExam = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateExam,
    onSuccess: (_, variables) => {
      // Invalidate specific exam and list
      queryClient.invalidateQueries({
        queryKey: queryKeys.exams.detail(variables.examId),
      });
      queryClient.invalidateQueries({
        queryKey: queryKeys.exams.all,
      });
    },
  });
};

export const useDeleteExam = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteExam,
    onSuccess: () => {
      // Invalidate exams list
      queryClient.invalidateQueries({
        queryKey: queryKeys.exams.all,
      });
    },
  });
};
