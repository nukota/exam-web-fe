import { Box, Typography, Chip } from "@mui/material";
import { EmojiEvents } from "@mui/icons-material";
import { Layout } from "../../components/common/Layout";
import { CustomDataGrid } from "../../components/common";
import Card from "../../components/common/Card";
import { mockLeaderboardData } from "../../shared/mockdata";
import type { GridColDef } from "@mui/x-data-grid";

export const AdminLeaderboardPage = () => {
  // const { examId } = useParams(); // For future use to fetch exam-specific leaderboard

  const columns: GridColDef[] = [
    {
      field: "rank",
      headerName: "Rank",
      width: 100,
      renderCell: (params) =>
        params.value <= 3 ? (
          <Chip
            label={params.value}
            color={params.value === 1 ? "warning" : "default"}
            size="small"
            sx={{ fontWeight: "bold" }}
          />
        ) : (
          <Typography>{params.value}</Typography>
        ),
    },
    {
      field: "name",
      headerName: "Student Name",
      flex: 1,
      minWidth: 180,
      renderCell: (params) => (
        <Typography fontWeight={params.row.rank <= 3 ? "bold" : "normal"}>
          {params.value}
        </Typography>
      ),
    },
    {
      field: "email",
      headerName: "Email",
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
        <Typography fontWeight="bold" color="primary">
          {params.value}
        </Typography>
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
  ];

  return (
    <Layout>
      <Box>
        <Box sx={{ display: "flex", alignItems: "center", mb: 3, gap: 1 }}>
          <EmojiEvents sx={{ color: "warning.main", fontSize: "2rem" }} />
          <Typography variant="h4" component="h1" fontWeight="bold">
            Exam Leaderboard
          </Typography>
        </Box>

        <Card sx={{ p: 3, mb: 3, bgcolor: "grey.50" }}>
          <Typography variant="h6" fontWeight="bold" gutterBottom>
            Introduction to Computer Science
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {mockLeaderboardData.length} students have submitted
          </Typography>
        </Card>

        <Card sx={{ p: 0, overflow: "hidden" }}>
          <CustomDataGrid
            rows={mockLeaderboardData}
            columns={columns}
            getRowId={(row) => row.rank.toString()}
            pageSize={10}
            pageSizeOptions={[10, 20, 50]}
          />
        </Card>
      </Box>
    </Layout>
  );
};
