import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Box,
  Typography,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import { Timer, Send, Code } from "@mui/icons-material";
import { mockCodingQuestions } from "../../shared/mockdata";
import { useExamTimer } from "../../shared/providers/ExamTimerProvider";
import { Card } from "../../components/common";

export const StudentCodingExamPage = () => {
  const { examId } = useParams();
  const navigate = useNavigate();
  const { timeRemaining, startTimer, formatTime } = useExamTimer();
  const [completedQuestions] = useState<Set<string>>(new Set());
  const [submitDialogOpen, setSubmitDialogOpen] = useState(false);

  const shakeAnimation = `
    @keyframes shake {
      0%, 100% { transform: rotate(0deg) translateY(0); }
      10%, 30%, 50%, 70%, 90% { transform: rotate(-10deg) translateY(-3px); }
      20%, 40%, 60%, 80% { transform: rotate(10deg) translateY(3px); }
    }
  `;

  useEffect(() => {
    // Start timer with 90 minutes (5400 seconds)
    startTimer(5400, handleSubmit);
  }, []);

  const handleSubmit = () => {
    console.log("Submitting coding exam");
    navigate(`/student/exam/${examId}/result`);
  };

  const handleQuestionClick = (questionId: string) => {
    navigate(`/student/exam/coding/${examId}/compiler/${questionId}`);
  };

  const totalPoints = mockCodingQuestions.reduce((sum, q) => sum + q.points, 0);
  const completedCount = completedQuestions.size;

  return (
    <Box sx={{ display: "flex", height: "100vh", bgcolor: "white" }}>
      {/* Left Section - Exam Info */}
      <Box
        sx={{
          width: 400,
          p: 3,
          px: { xs: 1, lg: 5 },
          display: "flex",
          flexDirection: "column",
          gap: 0,
          overflowY: "auto",
        }}
      >
        {/* Exam Title and Timer */}
        <Box sx={{ mb: 2 }}>
          <Typography variant="h6" fontWeight="bold" sx={{ mb: 2 }}>
            Python Programming Challenge
          </Typography>
          <Box
            sx={{
              p: 1.5,
              bgcolor: "grey.100",
              borderRadius: 2,
              display: "flex",
              alignItems: "center",
              gap: 1,
            }}
          >
            <style>{shakeAnimation}</style>
            <Timer
              fontSize="small"
              sx={{
                animation: timeRemaining <= 30 ? "shake 0.5s infinite" : "none",
              }}
            />
            <Typography variant="body1" fontWeight="bold" color="black">
              {formatTime(timeRemaining)}
            </Typography>
          </Box>
        </Box>

        {/* Progress */}
        <Box
          sx={{
            p: 2,
            mb: 2,
            bgcolor: "grey.100",
            borderRadius: 2,
          }}
        >
          <Typography
            variant="h6"
            fontWeight="bold"
            gutterBottom
            sx={{ textAlign: "left" }}
          >
            Progress
          </Typography>
          <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}>
            <Typography variant="body2" color="text.secondary">
              Completed:
            </Typography>
            <Typography variant="body2" fontWeight="bold">
              {completedCount} / {mockCodingQuestions.length}
            </Typography>
          </Box>
          <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
            <Typography variant="body2" color="text.secondary">
              Total Points:
            </Typography>
            <Typography variant="body2" fontWeight="bold">
              {totalPoints}
            </Typography>
          </Box>
        </Box>

        {/* Monitoring Status */}
        <Box
          sx={{
            p: 2,
            mb: 2,
            bgcolor: "grey.100",
            borderRadius: 2,
          }}
        >
          <Typography
            variant="h6"
            fontWeight="bold"
            gutterBottom
            sx={{ textAlign: "left" }}
          >
            Monitoring Status
          </Typography>
          <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}>
            <Typography variant="body2" color="text.secondary">
              Tab Switches:
            </Typography>
            <Typography variant="body2" fontWeight="bold">
              0
            </Typography>
          </Box>
          <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}>
            <Typography variant="body2" color="text.secondary">
              Face Detection:
            </Typography>
            <Typography variant="body2" fontWeight="bold">
              Active
            </Typography>
          </Box>
          <Box sx={{ display: "flex", justifyContent: "space-between" }}>
            <Typography variant="body2" color="text.secondary">
              Window Focus:
            </Typography>
            <Typography variant="body2" fontWeight="bold">
              Yes
            </Typography>
          </Box>
        </Box>

        {/* Question Status Map */}
        <Box sx={{ mb: 2 }}>
          <Typography
            variant="body2"
            fontWeight="bold"
            gutterBottom
            sx={{ textAlign: "left" }}
          >
            Question Map
          </Typography>
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: "repeat(6, 1fr)",
              gap: 0.5,
            }}
          >
            {mockCodingQuestions.map((question, index) => {
              const isCompleted = completedQuestions.has(question.question_id);
              return (
                <Box
                  key={question.question_id}
                  onClick={() => handleQuestionClick(question.question_id)}
                  sx={{
                    position: "relative",
                    width: "100%",
                    aspectRatio: "1",
                    overflow: "hidden",
                    cursor: "pointer",
                    bgcolor: isCompleted ? "grey.300" : "grey.100",
                    borderRadius: "4px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    "&:hover": {
                      bgcolor: "grey.300",
                    },
                  }}
                >
                  <Typography variant="body2" fontWeight="bold">
                    {index + 1}
                  </Typography>
                </Box>
              );
            })}
          </Box>
        </Box>

        {/* Submit Button */}
        <Button
          variant="contained"
          startIcon={<Send />}
          onClick={() => setSubmitDialogOpen(true)}
          sx={{
            mt: "auto",
            width: 180,
            ml: "auto",
            py: 1,
            fontWeight: "bold",
            backgroundColor: "grey.400",
            color: "black",
          }}
        >
          Submit Exam
        </Button>
      </Box>

      {/* Right Section - Questions List */}
      <Box
        sx={{
          flex: 1,
          overflowY: "auto",
          display: "flex",
          flexDirection: "column",
          gap: 0,
          p: 3,
          maxWidth: { xs: "100%", lg: "60%", xl: "50%" },
        }}
      >
        <Box
          sx={{
            textAlign: "left",
            px: 3,
            py: 2,
            mb: 3,
            borderRadius: 2,
            bgcolor: "rgb(227, 193, 0, 0.25)",
          }}
        >
          <Typography variant="h6">Coding Problems</Typography>
        </Box>
        <Box sx={{ gap: 3, display: "flex", flexDirection: "column" }}>
          {mockCodingQuestions.map((question, index) => (
            <Card
              key={question.question_id}
              onClick={() => handleQuestionClick(question.question_id)}
            >
              <Box sx={{ display: "flex", alignItems: "flex-start", gap: 2 }}>
                <Box
                  sx={{
                    minWidth: 40,
                    height: 40,
                    borderRadius: 1,
                    bgcolor: "grey.100",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Typography variant="body1" fontWeight="bold">
                    {index + 1}
                  </Typography>
                </Box>
                <Box sx={{ flex: 1, textAlign: "left" }}>
                  <Typography variant="h6" fontWeight="bold">
                    {question.title || question.question_text} (
                    {question.points} pts)
                  </Typography>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ mb: 2, mt: 1 }}
                  >
                    {question.question_text || "Solve this coding problem"}
                  </Typography>
                </Box>
                <Code sx={{ color: "grey.400" }} />
              </Box>
            </Card>
          ))}
        </Box>
      </Box>

      {/* Submit Confirmation Dialog */}
      <Dialog
        open={submitDialogOpen}
        onClose={() => setSubmitDialogOpen(false)}
      >
        <DialogTitle>Submit Exam?</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to submit your coding exam? You have completed{" "}
            {completedCount} out of {mockCodingQuestions.length} questions.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setSubmitDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleSubmit} variant="contained" color="success">
            Submit
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};
