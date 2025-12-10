import { useParams, useNavigate } from "react-router-dom";
import { Box, Typography, IconButton, Button } from "@mui/material";
import { ArrowLeft, Eye, AlertTriangle, SquarePen, Trash } from "lucide-react";
import type { GridColDef } from "@mui/x-data-grid";
import { Layout, CustomDataGrid } from "../../components/common";
import Card from "../../components/common/Card";
import {
  useExamAttempts,
  useDeleteAttempt,
  useCancelResult,
} from "../../services/attemptsService";
import type { ExamAttemptsPageItemDTO } from "../../shared/dtos/attempt.dto";
import { Flag } from "lucide-react";
import { useFeedback } from "../../shared/providers/FeedbackProvider";

export const AdminExamSubmissionsPage = () => {
  const { examId } = useParams();
  const navigate = useNavigate();
  const { showAlert, showSnackbar } = useFeedback();
  const {
    data: examAttempts,
    isLoading,
    error,
  } = useExamAttempts(examId || "");

  const deleteAttemptMutation = useDeleteAttempt();
  const cancelResultMutation = useCancelResult();

  const {
    title,
    max_score,
    total_attempts,
    graded_attempts,
    flagged_attempts,
    attempts,
  } = examAttempts || {
    title: "",
    max_score: 0,
    total_attempts: 0,
    graded_attempts: 0,
    flagged_attempts: 0,
    attempts: [],
  };

  const pendingCount = attempts.filter(
    (s: ExamAttemptsPageItemDTO) => s.status === "submitted"
  ).length;

  if (isLoading) {
    return (
      <Layout>
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            minHeight: "100vh",
          }}
        >
          <Typography>Loading exam attempts...</Typography>
        </Box>
      </Layout>
    );
  }

  if (error || !examAttempts) {
    return (
      <Layout>
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            minHeight: "100vh",
          }}
        >
          <Typography color="error">Failed to load exam attempts</Typography>
        </Box>
      </Layout>
    );
  }

  const handleViewAttempt = (attemptId: string) => {
    navigate(`/admin/submissions/${attemptId}`);
  };

  const handleGradeAttempt = (attemptId: string) => {
    navigate(`/admin/submissions/${attemptId}/grade`);
  };

  const handleCancelAttempt = (attemptId: string) => {
    showAlert({
      title: "Cancel Result",
      message: "Are you sure you want to cancel this result?",
      confirmText: "Cancel Result",
      cancelText: "Keep Result",
      severity: "warning",
      onConfirm: async () => {
        try {
          await cancelResultMutation.mutateAsync(attemptId);
          showSnackbar({
            message: "Result cancelled successfully",
            severity: "success",
          });
        } catch (error) {
          console.error("Failed to cancel result:", error);
          showSnackbar({
            message: "Failed to cancel result. Please try again.",
            severity: "error",
          });
        }
      },
    });
  };

  const handleDeleteAttempt = (attemptId: string) => {
    showAlert({
      title: "Delete Attempt",
      message:
        "Are you sure you want to delete this attempt? This action cannot be undone.",
      confirmText: "Delete",
      cancelText: "Cancel",
      severity: "error",
      onConfirm: async () => {
        try {
          await deleteAttemptMutation.mutateAsync(attemptId);
          showSnackbar({
            message: "Attempt deleted successfully",
            severity: "success",
          });
        } catch (error) {
          console.error("Failed to delete attempt:", error);
          showSnackbar({
            message: "Failed to delete attempt. Please try again.",
            severity: "error",
          });
        }
      },
    });
  };

  const columns: GridColDef[] = [
    {
      field: "student",
      headerName: "Student",
      flex: 1,
      minWidth: 200,
      renderCell: (params) => (
        <Box>
          <Typography variant="body1" fontWeight="bold">
            {params.row.student.full_name}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {params.row.student.email}
          </Typography>
        </Box>
      ),
    },
    {
      field: "submitted_at",
      headerName: "Submitted At",
      flex: 0.5,
      minWidth: 180,
      valueFormatter: (value) => {
        if (!value) return "N/A";
        const date = new Date(value);
        return date.toLocaleString("en-US", {
          month: "short",
          day: "numeric",
          year: "numeric",
          hour: "numeric",
          minute: "2-digit",
          hour12: true,
        });
      },
    },
    {
      field: "score",
      headerName: "Score",
      width: 120,
      renderCell: (params) => (
        <Typography variant="body2" sx={{ textAlign: "right", width: "100%" }}>
          {params.row.status === "graded"
            ? `${params.row.total_score} / ${max_score}`
            : "-"}
        </Typography>
      ),
    },
    {
      field: "percentage",
      headerName: "Percentage",
      width: 120,
      align: "center",
      headerAlign: "center",
      renderCell: (params) => {
        const percentage = params.row.percentage_score;
        const color =
          percentage && percentage >= 70
            ? "success.main"
            : percentage && percentage >= 50
            ? "warning.main"
            : "error.main";
        return (
          <Typography
            variant="body2"
            sx={{ textAlign: "right", width: "100%" }}
            color={color}
          >
            {percentage ? `${percentage.toFixed(1)}%` : "-"}
          </Typography>
        );
      },
    },
    {
      field: "status",
      headerName: "Status",
      width: 120,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "cheated",
      headerName: "Flagged as Cheating",
      width: 180,
      align: "center",
      headerAlign: "center",
      renderCell: (params) =>
        params.value ? (
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <Flag
              size={20}
              color={params.row.status === "cancelled" ? "#999" : "#f44336"}
            />
            <Button
              size="small"
              variant="text"
              color="error"
              disabled={params.row.status === "cancelled"}
              onClick={() => handleCancelAttempt(params.row.attempt_id)}
              sx={{ textTransform: "none", fontSize: "0.875rem" }}
            >
              {params.row.status === "cancelled"
                ? "Cancelled"
                : "Cancel result"}
            </Button>
          </Box>
        ) : null,
    },
    {
      field: "actions",
      headerName: "Actions",
      width: 120,
      align: "center",
      headerAlign: "center",
      sortable: false,
      renderCell: (params) => {
        const status = params.row.status;
        return (
          <Box
            sx={{
              display: "flex",
              gap: 1,
            }}
          >
            {status === "submitted" ? (
              <IconButton
                size="small"
                color="default"
                onClick={() => handleGradeAttempt(params.row.attempt_id)}
              >
                <SquarePen size={20} />
              </IconButton>
            ) : status === "graded" ? (
              <IconButton
                size="small"
                color="default"
                onClick={() => handleViewAttempt(params.row.attempt_id)}
              >
                <Eye size={20} />
              </IconButton>
            ) : (
              <Box sx={{ width: 30 }} />
            )}
            <IconButton
              size="small"
              color="default"
              onClick={() => handleDeleteAttempt(params.row.attempt_id)}
            >
              <Trash size={20} />
            </IconButton>
          </Box>
        );
      },
    },
  ];

  return (
    <Layout>
      <Box sx={{ display: "flex", flexDirection: "column", gap: 3, mb: 4 }}>
        {/* Header and Stats */}
        <Card sx={{ p: 2 }}>
          {/* Header */}
          <Box sx={{ textAlign: "left", mb: 3 }}>
            <Box
              sx={{ display: "flex", alignItems: "center", gap: 1, mb: 0.5 }}
            >
              <IconButton onClick={() => navigate("/admin/grading")}>
                <ArrowLeft size={24} color="black" />
              </IconButton>
              <Typography sx={{ fontWeight: "bold", fontSize: "1.75rem" }}>
                Exam Attempts
              </Typography>
            </Box>
            <Typography color="text.secondary" sx={{ pl: 6, fontSize: "1rem" }}>
              {title}
            </Typography>
          </Box>

          {/* Stats */}
          <Box sx={{ pl: 6, gap: 8, display: "flex", flexWrap: "wrap" }}>
            <Typography variant="body1" color="text.secondary">
              Total Attempts: <strong>{total_attempts}</strong>
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Graded: <strong>{graded_attempts}</strong>
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Pending: <strong>{pendingCount}</strong>
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Flagged: <strong>{flagged_attempts}</strong>
            </Typography>
          </Box>
        </Card>

        <Box
          sx={{
            px: 4,
            py: 2,
            bgcolor: "#fafafa",
            borderRadius: 2,
            textAlign: "left",
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            <AlertTriangle size={20} color="#999" />
            <Typography variant="body1" color="#999">
              All attempts must be graded before releasing results to students.
            </Typography>
          </Box>
        </Box>

        {/* Submissions Table */}
        <Card sx={{ p: 0, overflow: "hidden" }}>
          <CustomDataGrid
            rows={attempts}
            columns={columns}
            getRowId={(row) => row.attempt_id}
            pageSize={10}
            pageSizeOptions={[10, 20, 50]}
          />
        </Card>
      </Box>
    </Layout>
  );
};
