import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "../shared/lib/apiClient";
import { queryKeys } from "../shared/lib/queryKeys";
import { auth } from "../shared/lib/firebase";
import type {
  AllExamsPageDTO,
  DetailedExamDTO,
  CreateExamDTO,
  UpdateExamWithQuestionsDTO,
  Exam,
  GradingPageDTO,
} from "../shared/dtos/exam.dto";

const getAllExams = async (): Promise<AllExamsPageDTO> => {
  if (!auth.currentUser) throw new Error("Not authenticated");
  return api.get<AllExamsPageDTO>("/exams/all");
};

const getExamById = async (examId: string): Promise<DetailedExamDTO> => {
  if (!auth.currentUser) throw new Error("Not authenticated");
  return api.get<DetailedExamDTO>(`/exams/${examId}`);
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

const releaseExamResults = async (examId: string): Promise<void> => {
  if (!auth.currentUser) throw new Error("Not authenticated");
  return api.patch<void>(`/exams/${examId}/release-results`);
};

const getGradingExams = async (): Promise<GradingPageDTO> => {
  if (!auth.currentUser) throw new Error("Not authenticated");
  return api.get<GradingPageDTO>("/exams/grading");
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

export const useReleaseExamResults = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: releaseExamResults,
    onSuccess: () => {
      // Invalidate exams list to refetch updated status
      queryClient.invalidateQueries({
        queryKey: queryKeys.exams.all,
      });
    },
  });
};

export const useGradingExams = () => {
  return useQuery({
    queryKey: queryKeys.exams.list({ grading: true }),
    queryFn: getGradingExams,
    enabled: !!auth.currentUser,
    staleTime: 1 * 60 * 1000, // 1 minute
  });
};
