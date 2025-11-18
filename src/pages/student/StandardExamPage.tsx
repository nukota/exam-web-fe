import { useState, useEffect, useRef } from "react";
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
import { Timer, Send } from "@mui/icons-material";
import { mockQuestionsExam1 } from "../../shared/mockdata";
import { Question } from "../../components/student/items/Question";

export const StudentStandardExamPage = () => {
  const { examId } = useParams();
  const navigate = useNavigate();
  const [answers, setAnswers] = useState<Record<string, any>>({});
  const [flaggedQuestions, setFlaggedQuestions] = useState<Set<string>>(
    new Set()
  );
  const [timeRemaining, setTimeRemaining] = useState(300); // 60 minutes in seconds
  const [submitDialogOpen, setSubmitDialogOpen] = useState(false);
  const questionRefs = useRef<Record<string, HTMLDivElement | null>>({});

  const shakeAnimation = `
    @keyframes shake {
      0%, 100% { transform: rotate(0deg) translateY(0); }
      10%, 30%, 50%, 70%, 90% { transform: rotate(-10deg) translateY(-3px); }
      20%, 40%, 60%, 80% { transform: rotate(10deg) translateY(3px); }
    }
  `;

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev <= 1) {
          handleSubmit();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const handleAnswerChange = (questionId: string, value: any) => {
    setAnswers({ ...answers, [questionId]: value });
  };

  const handleToggleFlag = (questionId: string) => {
    setFlaggedQuestions((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(questionId)) {
        newSet.delete(questionId);
      } else {
        newSet.add(questionId);
      }
      return newSet;
    });
  };

  const handleSubmit = () => {
    // In a real app, submit answers to the backend
    console.log("Submitting answers:", answers);
    navigate(`/student/exam/${examId}/result`);
  };

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hours.toString().padStart(2, "0")}:${minutes
      .toString()
      .padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const scrollToQuestion = (questionId: string) => {
    questionRefs.current[questionId]?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  };

  const totalPoints = mockQuestionsExam1.reduce((sum, q) => sum + q.points, 0);
  const answeredCount = Object.keys(answers).length;

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
            Introduction to Computer Science
          </Typography>
          <Box
            sx={{
              p: 1.5,
              // border: "1px solid",
              // borderColor: "divider",
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

        {/* Progress and Monitoring Status */}
        <Box
          sx={{
            p: 2,
            mb: 2,
            // border: "1px solid",
            // borderColor: "divider",
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
              Answered:
            </Typography>
            <Typography variant="body2" fontWeight="bold">
              {answeredCount} / {mockQuestionsExam1.length}
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

        {/* Question Grid Map */}
        <Box>
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
              gridTemplateColumns: "repeat(8, 1fr)",
              gap: 0.5,
            }}
          >
            {mockQuestionsExam1.map((question, index) => {
              const isAnswered = answers[question.question_id] !== undefined;
              const isFlagged = flaggedQuestions.has(question.question_id);
              return (
                <Box
                  key={question.question_id}
                  onClick={() => scrollToQuestion(question.question_id)}
                  sx={{
                    position: "relative",
                    width: "100%",
                    aspectRatio: "1",
                    overflow: "hidden",
                    cursor: "pointer",
                    bgcolor: isAnswered ? "grey.300" : "grey.100",
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
                  {isFlagged && (
                    <Box
                      sx={{
                        position: "absolute",
                        top: 0,
                        right: 0,
                        width: 0,
                        height: 0,
                        borderTop: "10px solid",
                        borderTopColor: "primary.main",
                        borderLeft: "10px solid transparent",
                      }}
                    />
                  )}
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

      {/* Right Section - All Questions */}
      <Box
        sx={{
          flex: 1,
          overflowY: "auto",
          display: "flex",
          flexDirection: "column",
          gap: 4,
          p: 3,
          maxWidth: { xs: "100%", lg: "60%", xl: "50%" },
          pr: { xs: 1 },
        }}
      >
        <Box sx={{ mb: 2 }} />
        {mockQuestionsExam1.map((question, index) => (
          <Question
            key={question.question_id}
            question={question}
            index={index}
            answer={answers[question.question_id]}
            isFlagged={flaggedQuestions.has(question.question_id)}
            onAnswerChange={handleAnswerChange}
            onToggleFlag={handleToggleFlag}
            questionRef={(el: HTMLDivElement | null) => {
              questionRefs.current[question.question_id] = el;
            }}
          />
        ))}
      </Box>

      {/* Submit Confirmation Dialog */}
      <Dialog
        open={submitDialogOpen}
        onClose={() => setSubmitDialogOpen(false)}
      >
        <DialogTitle>Submit Exam?</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to submit your exam? You have answered{" "}
            {answeredCount} out of {mockQuestionsExam1.length} questions.
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
