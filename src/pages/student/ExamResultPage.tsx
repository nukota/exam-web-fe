import {
  Box,
  Typography,
  Paper,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  Divider,
} from "@mui/material";
import { CheckCircle, Cancel, EmojiEvents } from "@mui/icons-material";
import { Layout } from "../../components/common";
import { useNavigate } from "react-router-dom";
import type { Submission } from "../../shared/dtos";

// Mock data
const mockResult = {
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
        <Paper elevation={3} sx={{ p: 4, mb: 3, textAlign: "center" }}>
          <Typography variant="h4" gutterBottom fontWeight="bold">
            Exam Results
          </Typography>

          <Box sx={{ my: 3 }}>
            <Typography
              variant="h2"
              color={passed ? "success.main" : "error.main"}
              fontWeight="bold"
            >
              {mockResult.submission.total_score} / {mockResult.maxScore}
            </Typography>
            <Typography variant="h6" color="text.secondary">
              {percentage.toFixed(1)}%
            </Typography>
          </Box>

          <Chip
            icon={passed ? <CheckCircle /> : <Cancel />}
            label={passed ? "Passed" : "Not Passed"}
            color={passed ? "success" : "error"}
            sx={{ fontSize: "1.1rem", py: 2.5, px: 1 }}
          />

          <Box
            sx={{ mt: 3, display: "flex", justifyContent: "center", gap: 2 }}
          >
            <Box sx={{ textAlign: "center" }}>
              <Typography variant="h6" color="primary">
                {mockResult.rank}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Your Rank
              </Typography>
            </Box>
            <Divider orientation="vertical" flexItem />
            <Box sx={{ textAlign: "center" }}>
              <Typography variant="h6" color="primary">
                {mockResult.totalParticipants}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Total Students
              </Typography>
            </Box>
          </Box>
        </Paper>

        {/* Question Breakdown */}
        <Paper elevation={2} sx={{ p: 3, mb: 3 }}>
          <Typography variant="h6" gutterBottom fontWeight="bold">
            Question Breakdown
          </Typography>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Question</TableCell>
                  <TableCell align="center">Score</TableCell>
                  <TableCell align="center">Status</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {mockResult.questionResults.map((result, index) => (
                  <TableRow key={index}>
                    <TableCell>{result.question}</TableCell>
                    <TableCell align="center">
                      {result.earned} / {result.max}
                    </TableCell>
                    <TableCell align="center">
                      {result.correct ? (
                        <CheckCircle color="success" />
                      ) : (
                        <Cancel color="error" />
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>

        {/* Leaderboard */}
        <Paper elevation={2} sx={{ p: 3, mb: 3 }}>
          <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
            <EmojiEvents color="warning" sx={{ mr: 1 }} />
            <Typography variant="h6" fontWeight="bold">
              Leaderboard
            </Typography>
          </Box>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Rank</TableCell>
                  <TableCell>Name</TableCell>
                  <TableCell align="center">Score</TableCell>
                  <TableCell align="right">Submitted At</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {mockLeaderboard.map((entry) => (
                  <TableRow
                    key={entry.rank}
                    sx={{
                      bgcolor: entry.isCurrentUser
                        ? "primary.light"
                        : "inherit",
                      fontWeight: entry.isCurrentUser ? "bold" : "normal",
                    }}
                  >
                    <TableCell>
                      {entry.rank <= 3 ? (
                        <Chip
                          label={entry.rank}
                          color={entry.rank === 1 ? "warning" : "default"}
                          size="small"
                        />
                      ) : (
                        entry.rank
                      )}
                    </TableCell>
                    <TableCell>{entry.name}</TableCell>
                    <TableCell align="center">
                      <strong>{entry.score}</strong>
                    </TableCell>
                    <TableCell align="right">
                      {new Date(entry.submitted_at).toLocaleString()}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>

        <Box sx={{ display: "flex", justifyContent: "center", gap: 2 }}>
          <Button
            variant="outlined"
            onClick={() => navigate("/student/exams")}
          >
            Back to Exams
          </Button>
          <Button
            variant="contained"
            onClick={() => navigate("/student/results")}
          >
            View All Results
          </Button>
        </Box>
      </Box>
    </Layout>
  );
};
