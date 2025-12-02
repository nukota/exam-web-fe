import {
  Box,
  Typography,
  Button,
  CircularProgress,
  IconButton,
} from "@mui/material";
import { Layout, Card } from "../../components/common";
import { useNavigate, useParams } from "react-router-dom";
import { Leaderboard } from "../../components/student/Leaderboard";
import { ArrowLeft } from "lucide-react";
import { useExamLeaderboard } from "../../services/attemptsService";

export const StudentExamResultPage = () => {
  const { examId } = useParams();
  const navigate = useNavigate();
  const {
    data: resultData,
    isLoading,
    error,
  } = useExamLeaderboard(examId || "");

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
          <Typography>Loading exam results...</Typography>
        </Box>
      </Layout>
    );
  }

  if (error || !resultData) {
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
          <Typography color="error">Failed to load exam results</Typography>
        </Box>
      </Layout>
    );
  }

  const percentage = resultData.percentage_score || 0;
  const passed = percentage >= 60;

  return (
    <Layout>
      <Box>
        {/* Top Section - Results and Leaderboard */}
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: { xs: "1fr", lg: "1fr 1.5fr" },
            gap: 3,
          }}
        >
          {/* Results Card */}
          <Card
            sx={{
              px: 4,
              py: 3,
              textAlign: "center",
              background: passed
                ? "linear-gradient(135deg, #f0fdf4 0%, #ffffff 100%)"
                : "linear-gradient(135deg, #fef2f2 0%, #ffffff 100%)",
              position: "relative",
              overflow: "hidden",
              "&::before": {
                content: '""',
                position: "absolute",
                top: 0,
                left: 0,
                right: 0,
                height: "4px",
                background: passed
                  ? "linear-gradient(90deg, #4caf50, #66bb6a)"
                  : "linear-gradient(90deg, #f44336, #ef5350)",
              },
            }}
          >
            {/* Header */}
            <Box
              sx={{ display: "flex", alignItems: "flex-start", gap: 1, mb: 4 }}
            >
              <IconButton onClick={() => navigate(-1)}>
                <ArrowLeft size={20} color="black" />
              </IconButton>

              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "flex-start",
                }}
              >
                <Typography variant="h5" fontWeight="bold">
                  Exam Results
                </Typography>
                <Typography
                  variant="subtitle1"
                  color="text.secondary"
                  gutterBottom
                  sx={{ mb: 2 }}
                >
                  {resultData.exam.title}
                </Typography>
              </Box>
            </Box>

            <Box sx={{ my: 4, position: "relative", display: "inline-block" }}>
              <Box sx={{ position: "relative", display: "inline-flex" }}>
                <CircularProgress
                  variant="determinate"
                  value={100}
                  size={160}
                  thickness={3}
                  sx={{
                    color: "grey.200",
                    position: "absolute",
                  }}
                />
                <CircularProgress
                  variant="determinate"
                  value={percentage}
                  size={160}
                  thickness={3}
                  sx={{
                    color: passed ? "success.main" : "error.main",
                    position: "relative",
                  }}
                />
                <Box
                  sx={{
                    top: 0,
                    left: 0,
                    bottom: 0,
                    right: 0,
                    position: "absolute",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Typography
                    variant="h4"
                    color={passed ? "success.main" : "error.main"}
                    fontWeight="bold"
                  >
                    {resultData.total_score}/{resultData.exam.max_score}
                  </Typography>
                </Box>
              </Box>
            </Box>

            <Box sx={{ display: "flex", justifyContent: "center", gap: 2 }}>
              <Button
                variant="contained"
                onClick={() =>
                  navigate(`/student/submissions/${resultData.attempt_id}`)
                }
                sx={{
                  minWidth: 140,
                  fontWeight: "bold",
                  color: passed ? "success.main" : "error.main",
                  backgroundColor: passed ? "#4caf5020" : "#f4433620",
                  "&:hover": {
                    backgroundColor: passed ? "#4caf5030" : "#f4433630",
                  },
                }}
              >
                See Breakdown
              </Button>
              <Button
                variant="contained"
                onClick={() => navigate("/student/results")}
                sx={{
                  minWidth: 140,
                  fontWeight: "bold",
                  color: passed ? "success.main" : "error.main",
                  backgroundColor: passed ? "#4caf5020" : "#f4433620",
                  "&:hover": {
                    backgroundColor: passed ? "#4caf5030" : "#f4433630",
                  },
                }}
              >
                View All Results
              </Button>
            </Box>
          </Card>

          {/* Leaderboard Card */}
          <Leaderboard
            entries={resultData.leaderboard}
            currentUserRank={resultData.rank}
            totalParticipants={resultData.total_participants}
          />
        </Box>
      </Box>
    </Layout>
  );
};
