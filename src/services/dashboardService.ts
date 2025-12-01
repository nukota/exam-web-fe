import { useQuery } from "@tanstack/react-query";
import { api } from "../shared/lib/apiClient";
import { queryKeys } from "../shared/lib/queryKeys";
import type { DashboardDTO } from "../shared/dtos/dashboard.dto";
import { auth } from "../shared/lib/firebase";

const getDashboardData = async (): Promise<DashboardDTO> => {
  if (!auth.currentUser) throw new Error("Not authenticated");
  return api.get<DashboardDTO>("/dashboard");
};

// React Query Hook
export const useDashboard = () => {
  return useQuery({
    queryKey: queryKeys.dashboard.all,
    queryFn: getDashboardData,
  });
};
