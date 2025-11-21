import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Box, Typography, Button, IconButton } from "@mui/material";
import { Edit, Delete, Article, Add } from "@mui/icons-material";
import { Layout } from "../../components/common";
import { CustomDataGrid } from "../../components/common";
import { CreateExamDialog } from "../../components/admin/CreateExamDialog";
import { mockExams } from "../../shared/mockdata";
import { useFeedback } from "../../shared/providers/FeedbackProvider";
import type { GridColDef } from "@mui/x-data-grid";

export const AdminExamsPage = () => {
  const navigate = useNavigate();
  const { showSnackbar } = useFeedback();
  const [dialogOpen, setDialogOpen] = useState(false);

  const handleDelete = (examId: string) => {
    if (window.confirm("Are you sure you want to delete this exam?")) {
      console.log("Deleting exam:", examId);
      showSnackbar({
        message: "Exam deleted successfully",
        severity: "success",
      });
      // Implement delete logic
    }
  };

  const handleCreateExam = (examData: any) => {
    console.log("Creating exam:", examData);
    // In a real app, submit to backend and get the created exam ID
    const newExamId = "exam_" + Date.now();
    showSnackbar({ message: "Exam created successfully", severity: "success" });
    setDialogOpen(false);
    // Navigate to edit page to add questions
    navigate(`/admin/exams/${newExamId}/edit`);
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
      width: 120,
      renderCell: (params) => (
        <Typography variant="body2">
          {params.value === "coding" ? "Coding" : "Standard"}
        </Typography>
      ),
    },
    {
      field: "access_code",
      headerName: "Access Code",
      width: 130,
      renderCell: (params) => (
        <Typography variant="body2">{params.value}</Typography>
      ),
    },
    {
      field: "duration_minutes",
      headerName: "Duration",
      width: 100,
      valueFormatter: (value) => `${value} min`,
    },
    {
      field: "start_at",
      headerName: "Start Time",
      width: 180,
      valueFormatter: (value) =>
        value ? new Date(value).toLocaleString() : "N/A",
    },
    {
      field: "end_at",
      headerName: "End Time",
      width: 180,
      valueFormatter: (value) =>
        value ? new Date(value).toLocaleString() : "N/A",
    },
    {
      field: "actions",
      headerName: "Actions",
      width: 150,
      sortable: false,
      renderCell: (params) => (
        <Box>
          <IconButton
            size="small"
            color="inherit"
            onClick={() =>
              navigate(`/admin/exams/${params.row.exam_id}/leaderboard`)
            }
          >
            <Article />
          </IconButton>
          <IconButton
            size="small"
            color="inherit"
            onClick={() => navigate(`/admin/exams/${params.row.exam_id}/edit`)}
          >
            <Edit />
          </IconButton>
          <IconButton
            size="small"
            color="inherit"
            onClick={() => handleDelete(params.row.exam_id)}
          >
            <Delete />
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

        <CustomDataGrid
          rows={mockExams}
          columns={columns}
          getRowId={(row) => row.exam_id}
          pageSize={10}
          pageSizeOptions={[10, 20, 50]}
        />

        <CreateExamDialog
          open={dialogOpen}
          onClose={() => setDialogOpen(false)}
          onSubmit={handleCreateExam}
        />
      </Box>
    </Layout>
  );
};
