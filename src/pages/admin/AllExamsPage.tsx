import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Box, Typography, Button, IconButton } from "@mui/material";
import { Add } from "@mui/icons-material";
import {
  SquareTerminal,
  BookOpen,
  Copy,
  BarChart3,
  Edit,
  Trash2,
  Send,
} from "lucide-react";
import { Layout } from "../../components/common";
import { CustomDataGrid } from "../../components/common";
import { CreateExamDialog } from "../../components/admin/CreateExamDialog";
import { useFeedback } from "../../shared/providers/FeedbackProvider";
import {
  useExams,
  useCreateExam,
  useDeleteExam,
  useReleaseExamResults,
} from "../../services/examsService";
import { formatExamDateRange } from "../../shared/utils/utils";
import type { GridColDef } from "@mui/x-data-grid";

export const AdminExamsPage = () => {
  const navigate = useNavigate();
  const { showSnackbar, showAlert } = useFeedback();
  const [dialogOpen, setDialogOpen] = useState(false);

  const { data: exams, isLoading, error } = useExams();
  const createExamMutation = useCreateExam();
  const deleteExamMutation = useDeleteExam();
  const releaseResultsMutation = useReleaseExamResults();

  const handleDelete = (examId: string) => {
    showAlert({
      title: "Delete Exam",
      message:
        "Are you sure you want to delete this exam? This action cannot be undone.",
      confirmText: "Delete",
      cancelText: "Cancel",
      severity: "error",
      onConfirm: () => {
        deleteExamMutation.mutate(examId, {
          onSuccess: () => {
            showSnackbar({
              message: "Exam deleted successfully",
              severity: "success",
            });
          },
          onError: (error: any) => {
            showSnackbar({
              message: error.message || "Failed to delete exam",
              severity: "error",
            });
          },
        });
      },
    });
  };

  const handleReleaseResults = (examId: string) => {
    showAlert({
      title: "Release Results",
      message:
        "Are you sure you want to release the results for this exam? This action cannot be undone.",
      confirmText: "Release",
      cancelText: "Cancel",
      severity: "warning",
      onConfirm: () => {
        releaseResultsMutation.mutate(examId, {
          onSuccess: () => {
            showSnackbar({
              message: "Results released successfully",
              severity: "success",
            });
          },
          onError: (error: any) => {
            showSnackbar({
              message: error.message || "Failed to release results",
              severity: "error",
            });
          },
        });
      },
    });
  };

  const handleCreateExam = (examData: any) => {
    createExamMutation.mutate(examData, {
      onSuccess: (createdExam) => {
        showSnackbar({
          message: "Exam created successfully",
          severity: "success",
        });
        setDialogOpen(false);
        // Navigate to edit page based on exam type
        const editPath =
          examData.type === "coding"
            ? `/admin/exams/${createdExam.exam_id}/edit-coding`
            : `/admin/exams/${createdExam.exam_id}/edit-standard`;
        navigate(editPath);
      },
      onError: (error: any) => {
        showSnackbar({
          message: error.message || "Failed to create exam",
          severity: "error",
        });
      },
    });
  };

  const handleCopyAccessCode = async (accessCode: string) => {
    try {
      await navigator.clipboard.writeText(accessCode);
      showSnackbar({
        message: "Access code copied to clipboard",
        severity: "success",
      });
    } catch (err) {
      showSnackbar({
        message: "Failed to copy access code",
        severity: "error",
      });
    }
  };

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
      field: "type",
      headerName: "Type",
      width: 100,
      renderCell: (params) => (
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {params.value === "coding" ? (
            <SquareTerminal size={22} />
          ) : (
            <BookOpen size={22} />
          )}
        </Box>
      ),
    },
    {
      field: "question_amount",
      headerName: "Questions",
      width: 100,
      headerAlign: "center",
      renderCell: (params) => (
        <Typography variant="body2" sx={{ textAlign: "right", width: "100%" }}>
          {params.value}
        </Typography>
      ),
    },
    {
      field: "duration_minutes",
      headerName: "Duration",
      width: 100,
      headerAlign: "center",
      renderCell: (params) => (
        <Typography variant="body2" sx={{ textAlign: "right", width: "100%" }}>
          {params.value} min
        </Typography>
      ),
    },
    {
      field: "date",
      headerName: "Date",
      flex: 0.5,
      minWidth: 180,
      renderCell: (params) => (
        <Typography variant="body2">
          {formatExamDateRange(params.row.start_at, params.row.end_at)}
        </Typography>
      ),
    },
    {
      field: "status",
      headerName: "Status",
      width: 120,
      renderCell: (params) => (
        <Typography variant="body2" sx={{ textTransform: "capitalize" }}>
          {params.value}
        </Typography>
      ),
    },
    {
      field: "actions",
      headerName: "Actions",
      width: 200,
      sortable: false,
      renderCell: (params) => (
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <IconButton
            size="small"
            onClick={() => handleCopyAccessCode(params.row.access_code)}
            title="Copy Access Code"
          >
            <Copy size={20} />
          </IconButton>
          <IconButton
            size="small"
            onClick={() =>
              navigate(`/admin/exams/${params.row.exam_id}/leaderboard`)
            }
            title="View Leaderboard"
          >
            <BarChart3 size={20} />
          </IconButton>
          <IconButton
            size="small"
            onClick={() => handleReleaseResults(params.row.exam_id)}
            title="Release Results"
            disabled={params.row.status !== "graded"}
          >
            <Send size={20} />
          </IconButton>
          <IconButton
            size="small"
            onClick={() => {
              const editPath =
                params.row.type === "coding"
                  ? `/admin/exams/${params.row.exam_id}/edit-coding`
                  : `/admin/exams/${params.row.exam_id}/edit-standard`;
              navigate(editPath, {
                state: { isExamStarted: params.row.status !== "not started" },
              });
            }}
            title="Edit Exam"
          >
            <Edit size={20} />
          </IconButton>
          <IconButton
            size="small"
            onClick={() => handleDelete(params.row.exam_id)}
            title="Delete Exam"
          >
            <Trash2 size={20} />
          </IconButton>
        </Box>
      ),
    },
  ];

  return (
    <Layout>
      <Box>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 3,
          }}
        >
          <Typography variant="h4" component="h1" fontWeight="bold">
            All Exams
          </Typography>
          <Button
            variant="contained"
            startIcon={<Add />}
            onClick={() => setDialogOpen(true)}
            sx={{
              fontWeight: "bold",
              backgroundColor: "grey.400",
              color: "black",
            }}
          >
            Create New Exam
          </Button>
        </Box>

        {isLoading ? (
          <Typography>Loading exams...</Typography>
        ) : error ? (
          <Typography color="error">Failed to load exams</Typography>
        ) : (
          <CustomDataGrid
            rows={exams || []}
            columns={columns}
            getRowId={(row) => row.exam_id}
            pageSize={10}
            pageSizeOptions={[10, 20, 50]}
          />
        )}

        <CreateExamDialog
          open={dialogOpen}
          onClose={() => setDialogOpen(false)}
          onSubmit={handleCreateExam}
        />
      </Box>
    </Layout>
  );
};
