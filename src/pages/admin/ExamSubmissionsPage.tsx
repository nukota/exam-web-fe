import { useParams, useNavigate } from "react-router-dom";
import { Box, Typography, IconButton } from "@mui/material";
import { ArrowLeft, Eye, AlertTriangle } from "lucide-react";
import type { GridColDef } from "@mui/x-data-grid";
import { Layout, CustomDataGrid } from "../../components/common";
import Card from "../../components/common/Card";

interface SubmissionRow {
  submission_id: string;
  student_name: string;
  student_email: string;
  submitted_at: string;
  score: number;
  max_score: number;
  status: "submitted" | "graded";
  cheated: boolean;
}

// Mock data
const mockSubmissions: SubmissionRow[] = [
  {
    submission_id: "sub1",
    student_name: "Alice Johnson",
    student_email: "alice@example.com",
    submitted_at: "2025-11-14T10:30:00",
    score: 30.5,
    max_score: 33,
    status: "graded",
    cheated: false,
  },
  {
    submission_id: "sub2",
    student_name: "Bob Smith",
    student_email: "bob@example.com",
    submitted_at: "2025-11-14T10:45:00",
    score: 28,
    max_score: 33,
    status: "graded",
    cheated: false,
  },
  {
    submission_id: "sub3",
    student_name: "Carol White",
    student_email: "carol@example.com",
    submitted_at: "2025-11-14T11:00:00",
    score: 25,
    max_score: 33,
    status: "graded",
    cheated: true,
  },
  {
    submission_id: "sub4",
    student_name: "David Brown",
    student_email: "david@example.com",
    submitted_at: "2025-11-14T11:15:00",
    score: 0,
    max_score: 33,
    status: "submitted",
    cheated: false,
  },
  {
    submission_id: "sub5",
    student_name: "Eve Davis",
    student_email: "eve@example.com",
    submitted_at: "2025-11-14T11:30:00",
    score: 0,
    max_score: 33,
    status: "submitted",
    cheated: false,
  },
];

export const AdminExamSubmissionsPage = () => {
  const { examId: _ } = useParams();
  const navigate = useNavigate();

  const gradedCount = mockSubmissions.filter(
    (s) => s.status === "graded"
  ).length;
  const pendingCount = mockSubmissions.filter(
    (s) => s.status === "submitted"
  ).length;
  const flaggedCount = mockSubmissions.filter((s) => s.cheated).length;

  const handleViewSubmission = (submissionId: string) => {
    navigate(`/admin/submissions/${submissionId}`);
  };

  const columns: GridColDef[] = [
    {
      field: "student",
      headerName: "Student",
      flex: 1,
      minWidth: 200,
      renderCell: (params) => (
        <Box>
          <Typography variant="body2" fontWeight="bold">
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
      width: 180,
      valueFormatter: (value) => new Date(value).toLocaleString(),
    },
    {
      field: "score",
      headerName: "Score",
      width: 120,
      align: "center",
      headerAlign: "center",
      renderCell: (params) => (
        <Typography variant="body2" fontWeight="bold">
          {params.value} / {params.row.max_score}
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
        const percentage = (params.row.score / params.row.max_score) * 100;
        const color =
          percentage >= 70
            ? "success.main"
            : percentage >= 50
            ? "warning.main"
            : "error.main";
        return (
          <Typography variant="body2" fontWeight="bold" color={color}>
            {percentage.toFixed(1)}%
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
      renderCell: (params) => (
        <Typography
          variant="body2"
          fontWeight="bold"
          color={params.value === "graded" ? "success.main" : "text.primary"}
        >
          {params.value}
        </Typography>
      ),
    },
    {
      field: "cheated",
      headerName: "Flag",
      width: 80,
      align: "center",
      headerAlign: "center",
      renderCell: (params) =>
        params.value ? <AlertTriangle size={20} color="#f44336" /> : null,
    },
    {
      field: "actions",
      headerName: "Actions",
      width: 100,
      align: "center",
      headerAlign: "center",
      sortable: false,
      renderCell: (params) => (
        <IconButton
          size="small"
          onClick={() => handleViewSubmission(params.row.submission_id)}
          sx={{
            color: "text.secondary",
            "&:hover": {
              bgcolor: "action.hover",
            },
          }}
        >
          <Eye size={20} />
        </IconButton>
      ),
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
                Exam Submissions
              </Typography>
            </Box>
            <Typography color="text.secondary" sx={{ pl: 6, fontSize: "1rem" }}>
              Introduction to Computer Science
            </Typography>
          </Box>

          {/* Stats */}
          <Box sx={{ pl: 6, gap: 8, display: "flex", flexWrap: "wrap" }}>
            <Typography variant="body1" color="text.secondary">
              Total Submissions: <strong>{mockSubmissions.length}</strong>
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
              All submissions must be graded before releasing results to
              students.
            </Typography>
          </Box>
        </Box>

        {/* Submissions Table */}
        <Card sx={{ p: 0, overflow: "hidden" }}>
          <CustomDataGrid
            rows={mockSubmissions}
            columns={columns}
            getRowId={(row) => row.submission_id}
            pageSize={10}
            pageSizeOptions={[10, 20, 50]}
          />
        </Card>
      </Box>
    </Layout>
  );
};
