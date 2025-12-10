import {
  Box,
  Typography,
  IconButton,
  CircularProgress,
  Alert,
} from "@mui/material";
import { ClipboardEdit } from "lucide-react";
import type { GridColDef } from "@mui/x-data-grid";
import { Layout, CustomDataGrid } from "../../components/common";
import { useNavigate } from "react-router-dom";
import { useGradingExams } from "../../services/examsService";

export const AdminGradingPage = () => {
  const navigate = useNavigate();
  const { data: gradingData, isLoading, error } = useGradingExams();

  if (isLoading) {
    return (
      <Layout>
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "50vh",
          }}
        >
          <CircularProgress />
        </Box>
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout>
        <Box sx={{ p: 3 }}>
          <Alert severity="error">
            Failed to load grading data. Please try again later.
          </Alert>
        </Box>
      </Layout>
    );
  }

  // Filter only exams with pending submissions
  const examsWithPending = (gradingData || []).filter(
    (exam) => exam.pending_submissions > 0
  );

  const handleGradeExam = (examId: string) => {
    navigate(`/admin/grading/${examId}`);
  };

  const totalPending = examsWithPending.reduce(
    (sum, exam) => sum + exam.pending_submissions,
    0
  );

  const columns: GridColDef[] = [
    {
      field: "title",
      headerName: "Title",
      flex: 1,
      minWidth: 200,
      renderCell: (params) => (
        <Box sx={{ display: "flex", flexDirection: "column", gap: 0 }}>
          <Typography variant="body1" fontWeight="medium">
            {params.row.title}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            {params.row.description}
          </Typography>
        </Box>
      ),
    },
    {
      field: "teacher",
      headerName: "Teacher",
      flex: 0.6,
      minWidth: 180,
      renderCell: (params) => (
        <Box sx={{ display: "flex", flexDirection: "column", gap: 0 }}>
          <Typography variant="body2" fontWeight="medium">
            {params.row.teacher.full_name}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            {params.row.teacher.email}
          </Typography>
        </Box>
      ),
    },
    {
      field: "end_at",
      headerName: "End Time",
      flex: 0.75,
      minWidth: 200,
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
      field: "graded_submissions",
      headerName: "Graded Submissions",
      width: 200,
      headerAlign: "center",
      renderCell: (params) => {
        const graded =
          params.row.total_submissions - params.row.pending_submissions;
        return (
          <Typography
            variant="body2"
            sx={{ textAlign: "right", width: "100%" }}
          >
            {graded}/{params.row.total_submissions}
          </Typography>
        );
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
          onClick={() => handleGradeExam(params.row.exam_id)}
          sx={{
            color: "text.secondary",
            "&:hover": {
              bgcolor: "action.hover",
            },
          }}
        >
          <ClipboardEdit size={24} />
        </IconButton>
      ),
    },
  ];

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
            Grade Exams
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
            {totalPending} Pending Submissions
          </Typography>
        </Box>

        {examsWithPending.length > 0 ? (
          <CustomDataGrid
            rows={examsWithPending}
            columns={columns}
            getRowId={(row) => row.exam_id}
            pageSize={10}
            pageSizeOptions={[10, 20, 50]}
          />
        ) : (
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              minHeight: 400,
              bgcolor: "grey.50",
              borderRadius: 1,
              border: 1,
              borderColor: "grey.200",
            }}
          >
            <ClipboardEdit size={48} color="#9e9e9e" />
            <Typography
              variant="h6"
              color="text.secondary"
              sx={{ mt: 2, fontWeight: "medium" }}
            >
              No Pending Submissions
            </Typography>
            <Typography variant="body2" color="text.secondary">
              All submissions have been graded
            </Typography>
          </Box>
        )}
      </Box>
    </Layout>
  );
};
