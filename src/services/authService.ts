import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "../shared/lib/apiClient";
import { queryKeys } from "../shared/lib/queryKeys";
import type { User } from "../shared/dtos/user.dto";
import { auth } from "../shared/lib/firebase";
import { signOut as firebaseSignOut } from "firebase/auth";

const getMe = async (): Promise<User> => {
  if (!auth.currentUser) throw new Error("Not authenticated");
  return api.get<User>("/auth/me");
};

const syncUser = async (): Promise<User> => {
  if (!auth.currentUser) throw new Error("Not authenticated");
  return api.post<User>("/auth/sync", {});
};

const signOutUser = async (): Promise<void> => {
  await firebaseSignOut(auth);
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

export const useSignOut = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: signOutUser,
    onSuccess: () => {
      queryClient.removeQueries({ queryKey: queryKeys.auth.currentUser });
    },
  });
};
