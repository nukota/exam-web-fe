import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "../shared/lib/apiClient";
import { queryKeys } from "../shared/lib/queryKeys";
import type { User } from "../shared/dtos/user.dto";
import { auth } from "../shared/lib/firebase";

const updateUserProfile = async (data: Partial<User>): Promise<User> => {
  if (!auth.currentUser) throw new Error("Not authenticated");
  return api.patch<User>("/users/me", data);
};

const deleteUserById = async (userId: string): Promise<void> => {
  if (!auth.currentUser) throw new Error("Not authenticated");
  return api.delete<void>(`/users/${userId}`);
};

// React Query Hooks
export const useUpdateProfile = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateUserProfile,
    onSuccess: (data) => {
      queryClient.setQueryData(queryKeys.auth.currentUser, data);
      queryClient.invalidateQueries({
        queryKey: queryKeys.auth.currentUser,
      });
    },
  });
};

export const useDeleteUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteUserById,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["users"],
      });
    },
  });
};
