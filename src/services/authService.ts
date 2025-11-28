import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "../shared/lib/apiClient";
import { queryKeys } from "../shared/lib/queryKeys";
import type { User } from "../shared/dtos/user.dto";
import { auth } from "../shared/lib/firebase";

// API functions - Token automatically added by interceptor
const getMe = async (): Promise<User> => {
  if (!auth.currentUser) throw new Error("Not authenticated");
  return api.get<User>("/auth/me");
};

const syncUser = async (): Promise<User> => {
  if (!auth.currentUser) throw new Error("Not authenticated");
  return api.post<User>("/auth/sync", {});
};

const updateUserProfile = async (data: Partial<User>): Promise<User> => {
  if (!auth.currentUser) throw new Error("Not authenticated");
  return api.patch<User>("/users/me", data);
};

// React Query Hooks

/**
 * Hook to get current user from backend
 * Automatically fetches when Firebase user is authenticated
 */
export const useCurrentUser = (enabled: boolean = true) => {
  return useQuery({
    queryKey: queryKeys.auth.currentUser,
    queryFn: getMe,
    enabled: enabled && !!auth.currentUser,
    retry: false,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

/**
 * Hook to sync Firebase user with backend
 * Use this during login/signup
 */
export const useSyncUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: syncUser,
    onSuccess: (data) => {
      // Update cached user data
      queryClient.setQueryData(queryKeys.auth.currentUser, data);
    },
  });
};

/**
 * Hook to update user profile
 */
export const useUpdateProfile = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateUserProfile,
    onSuccess: (data) => {
      // Update cached user data
      queryClient.setQueryData(queryKeys.auth.currentUser, data);
      // Invalidate to refetch
      queryClient.invalidateQueries({
        queryKey: queryKeys.auth.currentUser,
      });
    },
  });
};
