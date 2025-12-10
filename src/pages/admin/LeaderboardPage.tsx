import { Box, Typography, IconButton } from "@mui/material";
import { Layout } from "../../components/common/Layout";
import { CustomDataGrid } from "../../components/common";
import Card from "../../components/common/Card";
import type { GridColDef } from "@mui/x-data-grid";
import { ArrowLeft, Trophy, Crown, Eye } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { useAdminExamLeaderboard } from "../../services/attemptsService";

export const AdminLeaderboardPage = () => {
  const { examId } = useParams();
  const navigate = useNavigate();
  const {
    data: leaderboardData,
    isLoading,
    error,
  } = useAdminExamLeaderboard(examId || "");

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
          <Typography>Loading leaderboard...</Typography>
        </Box>
      </Layout>
    );
  }

  if (error || !leaderboardData) {
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
          <Typography color="error">Failed to load leaderboard</Typography>
        </Box>
      </Layout>
    );
  }

  const maxScore = leaderboardData.exam.max_score;
  const columns: GridColDef[] = [
    {
      field: "rank",
      headerName: "Rank",
      width: 100,
      renderCell: (params) => (
        <Typography
          variant="body2"
          fontWeight="bold"
          color={params.value <= 3 ? "primary.main" : "text.primary"}
        >
          #{params.value}
        </Typography>
      ),
    },
    {
      field: "student",
      headerName: "Student",
      flex: 0.8,
      minWidth: 200,
      renderCell: (params) => (
        <Box sx={{ display: "flex", flexDirection: "column", gap: 0 }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <Typography fontWeight={params.row.rank <= 3 ? "bold" : "normal"}>
              {params.value.full_name}
            </Typography>
            {params.row.rank === 1 && <Crown size={16} color="#f59e0b" />}
          </Box>
          <Typography variant="caption" color="text.secondary">
            {params.value.email}
          </Typography>
        </Box>
      ),
    },
    {
      field: "score",
      headerName: "Score",
      width: 120,
      headerAlign: "center",
      renderCell: (params) => (
        <Typography
          fontWeight="bold"
          sx={{ textAlign: "right", width: "100%" }}
        >
          {params.row.status === "graded" || params.row.status === "submitted"
            ? params.value !== null && params.value !== undefined
              ? `${params.value}/${maxScore}`
              : "-"
            : "-"}
        </Typography>
      ),
    },
    {
      field: "percentage",
      headerName: "Percentage",
      width: 120,
      headerAlign: "center",
      renderCell: (params) => {
        if (
          params.row.status !== "graded" &&
          params.row.status !== "submitted"
        ) {
          return (
            <Typography
              fontWeight="bold"
              sx={{ textAlign: "right", width: "100%" }}
              color="text.secondary"
            >
              -
            </Typography>
          );
        }
        if (params.row.score === null || params.row.score === undefined) {
          return (
            <Typography
              fontWeight="bold"
              sx={{ textAlign: "right", width: "100%" }}
              color="text.secondary"
            >
              -
            </Typography>
          );
        }
        const percentage = (params.row.score / maxScore) * 100;
        return (
          <Typography
            fontWeight="bold"
            sx={{ textAlign: "right", width: "100%" }}
            color={
              percentage >= 80
                ? "#4caf50"
                : percentage >= 60
                ? "#ff9800"
                : "#f44336"
            }
          >
            {percentage.toFixed(1)}%
          </Typography>
        );
      },
    },
    {
      field: "submitted_at",
      headerName: "Submitted At",
      flex: 0.75,
      minWidth: 180,
      align: "right",
      headerAlign: "center",
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
      field: "status",
      headerName: "Status",
      width: 120,
      align: "center",
      headerAlign: "center",
      renderCell: (params) => (
        <Typography
          variant="body2"
          sx={{
            textTransform: "capitalize",
            color:
              params.value === "submitted"
                ? "success.main"
                : params.value === "in_progress"
                ? "warning.main"
                : "text.secondary",
          }}
        >
          {params.value.replace(/_/g, " ")}
        </Typography>
      ),
    },
    {
      field: "actions",
      headerName: "Actions",
      width: 100,
      sortable: false,
      align: "center",
      headerAlign: "center",
      renderCell: (params) => (
        <IconButton
          size="small"
          onClick={() =>
            navigate(`/admin/submissions/${params.row.attempt_id}`)
          }
          title="View Submission Details"
        >
          <Eye size={20} />
        </IconButton>
      ),
    },
  ];

  return (
    <Layout>
      <Box>
        <Box sx={{ display: "flex", alignItems: "center", mb: 3, gap: 1 }}>
          <IconButton onClick={() => navigate("/admin/exams")}>
            <ArrowLeft size={32} color="black" />
          </IconButton>
          <Typography
            variant="h4"
            component="h1"
            fontWeight="bold"
            sx={{ mr: 1 }}
          >
            Exam Leaderboard
          </Typography>
          <Trophy size={28} color="#999" />
        </Box>

        <Box sx={{ px: { xs: 0, lg: "7%", xl: "20%" } }}>
          <Card sx={{ p: 3, mb: 3, bgcolor: "grey.50" }}>
            <Typography variant="h6" fontWeight="bold" gutterBottom>
              {leaderboardData.exam.title}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {leaderboardData.leaderboard.length} students have submitted
            </Typography>
          </Card>

          <Card sx={{ p: 0, overflow: "hidden" }}>
            <CustomDataGrid
              rows={leaderboardData.leaderboard}
              columns={columns}
              getRowId={(row) => row.rank.toString()}
              pageSize={10}
              pageSizeOptions={[10, 20, 50]}
            />
          </Card>
        </Box>
      </Box>
    </Layout>
  );
};
