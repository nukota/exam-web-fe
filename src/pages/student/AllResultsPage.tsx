import { Box, Typography, Paper, Button, IconButton } from "@mui/material";
import { Check, X, Eye } from "lucide-react";
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
      renderCell: (params) => (
        <Typography variant="body2" fontWeight="medium">
          {params.value}
        </Typography>
      ),
    },
    {
      field: "score",
      headerName: "Score",
      width: 120,
      align: "center",
      headerAlign: "center",
      renderCell: (params) => (
        <Typography variant="body2" fontWeight="medium">
          {params.value} / {params.row.maxScore}
        </Typography>
      ),
    },
    {
      field: "percentage",
      headerName: "Percentage",
      width: 100,
      align: "center",
      headerAlign: "center",
      renderCell: (params) => {
        const percentage = calculatePercentage(
          params.row.score,
          params.row.maxScore
        );
        return (
          <Typography
            variant="body2"
            color={params.row.passed ? "success.main" : "error.main"}
            fontWeight="medium"
          >
            {percentage}%
          </Typography>
        );
      },
    },
    {
      field: "passed",
      headerName: "Status",
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
      field: "submitted_at",
      headerName: "Submitted At",
      flex: 0.75,
      minWidth: 180,
      valueFormatter: (value) =>
        value ? new Date(value).toLocaleString() : "N/A",
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
          onClick={() => navigate(`/student/exam/${params.row.exam_id}/result`)}
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

  const totalExams = mockResults.length;
  const passedExams = mockResults.filter((result) => result.passed).length;

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

        {mockResults.length > 0 ? (
          <CustomDataGrid
            rows={mockResults}
            columns={columns}
            getRowId={(row) => row.exam_id}
            pageSize={10}
            pageSizeOptions={[10, 20, 50]}
          />
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
