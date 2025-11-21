import {
  Box,
  Typography,
  Button,
  CircularProgress,
  IconButton,
} from "@mui/material";
import { Layout, Card } from "../../components/common";
import { useNavigate } from "react-router-dom";
import type { Submission } from "../../shared/dtos";
import { Leaderboard } from "../../components/student/Leaderboard";
import { ArrowLeft } from "lucide-react";

// Mock data
const mockResult = {
  exam_title: "Introduction to Computer Science",
  submission: {
    submission_id: "1",
    exam_id: "1",
    user_id: "student1",
    submitted_at: "2025-11-14T10:30:00",
    total_score: 8,
    status: "graded",
  } as Submission,
  maxScore: 11,
  rank: 5,
  totalParticipants: 50,
  questionResults: [
    {
      question: "What is the time complexity of binary search?",
      earned: 2,
      max: 2,
      correct: true,
    },
    {
      question: "Which of the following are programming paradigms?",
      earned: 2,
      max: 3,
      correct: false,
    },
    { question: "What does CPU stand for?", earned: 1, max: 1, correct: true },
    {
      question: "Explain the concept of recursion",
      earned: 3,
      max: 5,
      correct: true,
    },
  ],
};

const mockLeaderboard = [
  {
    rank: 1,
    name: "Alice Johnson",
    score: 11,
    submitted_at: "2025-11-14T09:45:00",
  },
  {
    rank: 2,
    name: "Bob Smith",
    score: 10,
    submitted_at: "2025-11-14T10:12:00",
  },
  {
    rank: 3,
    name: "Carol White",
    score: 9,
    submitted_at: "2025-11-14T10:05:00",
  },
  {
    rank: 4,
    name: "David Brown",
    score: 9,
    submitted_at: "2025-11-14T10:20:00",
  },
  {
    rank: 5,
    name: "You",
    score: 8,
    submitted_at: "2025-11-14T10:30:00",
    isCurrentUser: true,
  },
];

export const StudentExamResultPage = () => {
  // const { examId } = useParams(); // For future use to fetch exam-specific results
  const navigate = useNavigate();

  const percentage =
    (mockResult.submission.total_score / mockResult.maxScore) * 100;
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
                  {mockResult.exam_title}
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
                    {mockResult.submission.total_score}/{mockResult.maxScore}
                  </Typography>
                </Box>
              </Box>
            </Box>

            <Box sx={{ display: "flex", justifyContent: "center", gap: 2 }}>
              <Button
                variant="contained"
                onClick={() =>
                  navigate(
                    `/student/submissions/${mockResult.submission.submission_id}`
                  )
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
            entries={mockLeaderboard}
            currentUserRank={mockResult.rank}
            totalParticipants={mockResult.totalParticipants}
          />
        </Box>
      </Box>
    </Layout>
  );
};
