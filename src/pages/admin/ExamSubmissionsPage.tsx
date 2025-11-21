import { useParams, useNavigate } from "react-router-dom";
import { Box, Typography, IconButton, Button } from "@mui/material";
import { ArrowLeft, Eye, AlertTriangle, SquarePen, Trash } from "lucide-react";
import type { GridColDef } from "@mui/x-data-grid";
import { Layout, CustomDataGrid } from "../../components/common";
import Card from "../../components/common/Card";
import { mockExamAttemptsPage } from "../../shared/mockdata";
import { Flag } from "lucide-react";

export const AdminExamSubmissionsPage = () => {
  const { examId: _ } = useParams();
  const navigate = useNavigate();

  const { exam_title, max_score, attempts } = mockExamAttemptsPage;

  const gradedCount = attempts.filter((s) => s.status === "graded").length;
  const pendingCount = attempts.filter((s) => s.status === "submitted").length;
  const flaggedCount = attempts.filter((s) => s.cheated).length;

  const handleViewAttempt = (attemptId: string) => {
    navigate(`/admin/submissions/${attemptId}`);
  };

  const handleGradeAttempt = (attemptId: string) => {
    navigate(`/admin/submissions/${attemptId}/grade`);
  };

  const handleCancelAttempt = (attemptId: string) => {
    // TODO: Call backend API to cancel/invalidate the attempt
    console.log("Cancelling attempt:", attemptId);
    // In a real app, this would make an API call and refresh the data
  };

  const handleDeleteAttempt = (attemptId: string) => {
    // TODO: Call backend API to delete the attempt
    console.log("Deleting attempt:", attemptId);
    // In a real app, this would make an API call and refresh the data
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
            {params.row.student_name}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {params.row.student_email}
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
        <Typography variant="body2">
          {params.row.status === "graded"
            ? `${params.value} / ${max_score}`
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
        const percentage = (params.row.score / max_score) * 100;
        const color =
          percentage >= 70
            ? "success.main"
            : percentage >= 50
            ? "warning.main"
            : "error.main";
        return (
          <Typography variant="body2" color={color}>
            {params.row.status === "graded" ? `${percentage.toFixed(1)}%` : "-"}
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
            <Flag size={20} color="#f44336" />
            <Button
              size="small"
              variant="text"
              color="error"
              onClick={() => handleCancelAttempt(params.row.attempt_id)}
              sx={{ textTransform: "none", fontSize: "0.875rem" }}
            >
              Cancel result
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
              {exam_title}
            </Typography>
          </Box>

          {/* Stats */}
          <Box sx={{ pl: 6, gap: 8, display: "flex", flexWrap: "wrap" }}>
            <Typography variant="body1" color="text.secondary">
              Total Attempts: <strong>{attempts.length}</strong>
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Graded: <strong>{gradedCount}</strong>
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Pending: <strong>{pendingCount}</strong>
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Flagged: <strong>{flaggedCount}</strong>
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
