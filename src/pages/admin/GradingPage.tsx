import { Box, Typography, IconButton } from "@mui/material";
import { Check, X, ClipboardEdit } from "lucide-react";
import type { GridColDef } from "@mui/x-data-grid";
import { Layout, CustomDataGrid } from "../../components/common";
import { useNavigate } from "react-router-dom";

interface ExamForGrading {
  exam_id: string;
  title: string;
  duration_minutes: number;
  end_at: string;
  ended: boolean;
  total_submissions: number;
  pending_submissions: number;
}

// Mock data
const mockExamsForGrading: ExamForGrading[] = [
  {
    exam_id: "1",
    title: "Introduction to Computer Science",
    duration_minutes: 60,
    end_at: "2025-11-15T18:00:00",
    ended: true,
    total_submissions: 25,
    pending_submissions: 5,
  },
  {
    exam_id: "2",
    title: "Advanced Data Structures",
    duration_minutes: 90,
    end_at: "2025-11-16T20:00:00",
    ended: true,
    total_submissions: 18,
    pending_submissions: 0,
  },
  {
    exam_id: "3",
    title: "Web Development Final",
    duration_minutes: 120,
    end_at: "2025-11-20T22:00:00",
    ended: false,
    total_submissions: 10,
    pending_submissions: 10,
  },
];

export const AdminGradingPage = () => {
  const navigate = useNavigate();

  const handleGradeExam = (examId: string) => {
    navigate(`/admin/grading/${examId}`);
  };

  const totalPending = mockExamsForGrading.reduce(
    (sum, exam) => sum + exam.pending_submissions,
    0
  );

  const columns: GridColDef[] = [
    {
      field: "title",
      headerName: "Exam Title",
      flex: 1,
      minWidth: 200,
      renderCell: (params) => (
        <Typography variant="body2" fontWeight="medium">
          {params.value}
        </Typography>
      ),
    },

    {
      field: "end_at",
      headerName: "End Time",
      flex: 0.75,
      minWidth: 180,
      valueFormatter: (value) =>
        value ? new Date(value).toLocaleString() : "N/A",
    },
    {
      field: "status",
      headerName: "Ended",
      width: 110,
      align: "center",
      headerAlign: "center",
      renderCell: (params) => (
        <Box>
          {params.value ? (
            <Check size={20} color="#4caf50" />
          ) : (
            <X size={20} color="#f44336" />
          )}
        </Box>
      ),
    },

    {
      field: "total_submissions",
      headerName: "Total Subm",
      width: 80,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "pending_submissions",
      headerName: "Pending",
      width: 80,
      align: "center",
      headerAlign: "center",
      renderCell: (params) => (
        <Typography
          variant="body2"
          sx={{
            color: "text.secondary",
          }}
        >
          {params.value}
        </Typography>
      ),
    },
    {
      field: "grading_status",
      headerName: "Status",
      width: 110,
      align: "center",
      headerAlign: "center",
      renderCell: (params) => (
        <Box>
          {params.row.pending_submissions === 0 ? (
            <Check size={20} color="#4caf50" />
          ) : (
            <X size={20} color="#f44336" />
          )}
        </Box>
      ),
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
          disabled={params.row.total_submissions === 0}
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

        <CustomDataGrid
          rows={mockExamsForGrading}
          columns={columns}
          getRowId={(row) => row.exam_id}
          pageSize={10}
          pageSizeOptions={[10, 20, 50]}
        />
      </Box>
    </Layout>
  );
};
