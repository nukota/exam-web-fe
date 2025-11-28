import { Navigate } from "react-router-dom";
import { Box, CircularProgress } from "@mui/material";
import type { ReactNode } from "react";
import { useCurrentUser } from "../../services/authService";
import { auth } from "../../shared/lib/firebase";

interface ProtectedRouteProps {
  children: ReactNode;
  allowedRoles?: Array<"student" | "teacher" | "admin">;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  allowedRoles,
}) => {
  const { data: currentUser, isLoading } = useCurrentUser();
  const firebaseUser = auth.currentUser;

  if (isLoading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="100vh"
      >
        <CircularProgress />
      </Box>
    );
  }

  if (!firebaseUser || !currentUser) {
    return <Navigate to="/signin" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(currentUser.role)) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};
