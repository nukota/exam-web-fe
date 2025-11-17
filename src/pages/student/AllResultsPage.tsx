import { Box, Typography, Paper, Chip, Button } from "@mui/material";
import { CheckCircle, Cancel, Visibility } from "@mui/icons-material";
import { Layout } from "../../components/common/Layout";
import { CustomDataGrid } from "../../components/common";
import { calculatePercentage } from "../../shared/utils";
import { useNavigate } from "react-router-dom";
import { mockResults } from "../../shared/mockdata";
import type { GridColDef } from "@mui/x-data-grid";

export const StudentAllResultsPage = () => {
  const navigate = useNavigate();

  const columns: GridColDef[] = [
    {
      field: "title",
      headerName: "Exam Title",
      flex: 1,
      minWidth: 200,
    },
    {
      field: "score",
      headerName: "Score",
      width: 120,
      align: "center",
      headerAlign: "center",
      renderCell: (params) => (
        <Typography fontWeight="bold">
          {params.value} / {params.row.maxScore}
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
        const percentage = calculatePercentage(
          params.row.score,
          params.row.maxScore
        );
        return (
          <Typography
            color={params.row.passed ? "success.main" : "error.main"}
            fontWeight="bold"
          >
            {percentage}%
          </Typography>
        );
      },
    },
    {
      field: "passed",
      headerName: "Status",
      width: 150,
      align: "center",
      headerAlign: "center",
      renderCell: (params) => (
        <Chip
          icon={params.value ? <CheckCircle /> : <Cancel />}
          label={params.value ? "Passed" : "Not Passed"}
          color={params.value ? "success" : "error"}
          size="small"
        />
      ),
    },
    {
      field: "submitted_at",
      headerName: "Submitted At",
      width: 180,
      align: "right",
      headerAlign: "right",
      valueFormatter: (value) => new Date(value).toLocaleString(),
    },
    {
      field: "actions",
      headerName: "Actions",
      width: 120,
      align: "center",
      headerAlign: "center",
      sortable: false,
      renderCell: (params) => (
        <Button
          size="small"
          variant="outlined"
          startIcon={<Visibility />}
          onClick={() => navigate(`/student/exam/${params.row.exam_id}/result`)}
        >
          View
        </Button>
      ),
    },
  ];

  return (
    <Layout>
      <Box>
        <Typography variant="h4" component="h1" fontWeight="bold" gutterBottom>
          My Exam Results
        </Typography>

        {mockResults.length > 0 ? (
          <Box sx={{ mt: 3 }}>
            <CustomDataGrid
              rows={mockResults}
              columns={columns}
              getRowId={(row) => row.exam_id}
              pageSize={10}
              pageSizeOptions={[10, 20, 50]}
            />
          </Box>
        ) : (
          <Paper elevation={2} sx={{ p: 4, mt: 3, textAlign: "center" }}>
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
          </Paper>
        )}
      </Box>
    </Layout>
  );
};
