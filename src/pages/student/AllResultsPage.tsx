import { Box, Typography, Button, IconButton } from "@mui/material";
import { Eye } from "lucide-react";
import { Layout } from "../../components/common/Layout";
import { Card, CustomDataGrid } from "../../components/common";
import { useNavigate } from "react-router-dom";
import { useMyResults } from "../../services/attemptsService";
import type { GridColDef } from "@mui/x-data-grid";

export const StudentAllResultsPage = () => {
  const navigate = useNavigate();
  const { data: resultsData, isLoading, error } = useMyResults();

  const columns: GridColDef[] = [
    {
      field: "exam.title",
      headerName: "Title",
      flex: 1,
      minWidth: 200,
      renderCell: (params) => (
        <Box sx={{ display: "flex", flexDirection: "column", gap: 0 }}>
          <Typography variant="body1" fontWeight="medium">
            {params.row.exam.title}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            {params.row.exam.description}
          </Typography>
        </Box>
      ),
    },
    {
      field: "total_score",
      headerName: "Score",
      width: 120,
      align: "center",
      headerAlign: "center",
      renderCell: (params) => (
        <Typography variant="body2" fontWeight="medium">
          {params.row.status !== "graded"
            ? "-"
            : `${params.value} / ${params.row.exam.max_score}`}
        </Typography>
      ),
    },
    {
      field: "percentage_score",
      headerName: "Percentage",
      width: 100,
      align: "center",
      headerAlign: "center",
      renderCell: (params) => {
        const percentage = params.value;
        const passed = percentage >= 60; // Assuming 60% is passing
        return (
          <Typography
            variant="body2"
            color={passed ? "success.main" : "error.main"}
            fontWeight="medium"
          >
            {params.row.status !== "graded"
              ? "-"
              : `${percentage?.toFixed(1)}%`}
          </Typography>
        );
      },
    },
    {
      field: "status",
      headerName: "Status",
      width: 150,
      align: "center",
      headerAlign: "center",
      renderCell: (params) => {
        const statusColors = {
          graded: "success.main",
          submitted: "success.main",
          in_progress: "info.main",
          not_started: "text.secondary",
          overdue: "error.main",
          cancelled: "text.secondary",
        };
        return (
          <Typography
            variant="body2"
            color={
              statusColors[params.value as keyof typeof statusColors] ||
              "text.secondary"
            }
            fontWeight="medium"
          >
            {params.value?.replace("_", " ")}
          </Typography>
        );
      },
    },
    {
      field: "submitted_at",
      headerName: "Submitted At",
      flex: 0.6,
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
      field: "actions",
      headerName: "Actions",
      width: 120,
      align: "center",
      headerAlign: "center",
      sortable: false,
      renderCell: (params) => (
        <IconButton
          size="small"
          disabled={params.row.status !== "graded"}
          onClick={() =>
            navigate(`/student/exam/${params.row.exam.exam_id}/result`)
          }
          sx={{
            color: "text.secondary",
            "&:hover": {
              bgcolor: "action.hover",
            },
          }}
        >
          <Eye size={24} />
        </IconButton>
      ),
    },
  ];

  const results = resultsData?.results || [];
  const totalExams = results.length;
  const passedExams = results.filter(
    (result) => result.percentage_score && result.percentage_score >= 60
  ).length;

  if (isLoading) {
    return (
      <Layout>
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            minHeight: "50vh",
          }}
        >
          <Typography>Loading results...</Typography>
        </Box>
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout>
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            minHeight: "50vh",
          }}
        >
          <Typography color="error">Failed to load results</Typography>
        </Box>
      </Layout>
    );
  }

  return (
    <Layout>
      <Box>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            mb: 3,
          }}
        >
          <Typography variant="h4" component="h1" fontWeight="bold">
            My Exam Results
          </Typography>
          <Typography
            variant="body1"
            sx={{
              color: "text.secondary",
              bgcolor: "grey.300",
              ml: 2,
              px: 1,
              py: 0.5,
              borderRadius: 1,
              flexShrink: 0,
            }}
          >
            {passedExams} / {totalExams} Passed
          </Typography>
        </Box>

        {results.length > 0 ? (
          <CustomDataGrid
            rows={results}
            columns={columns}
            getRowId={(row) => row.attempt_id}
            pageSize={10}
            pageSizeOptions={[10, 20, 50]}
          />
        ) : (
          <Card
            sx={{
              height: 400,
              alignContent: "center",
              justifyContent: "center",
            }}
          >
            <Typography variant="h6" color="text.secondary">
              No exam results yet
            </Typography>
            <Button
              variant="contained"
              sx={{ mt: 2 }}
              onClick={() => navigate("/student/exams")}
            >
              Take an Exam
            </Button>
          </Card>
        )}
      </Box>
    </Layout>
  );
};
