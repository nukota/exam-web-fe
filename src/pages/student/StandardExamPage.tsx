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
import { Question } from "../../components/student/items/Question";
import { useExam } from "../../services/examsService";
import { useSubmitExam } from "../../services/attemptsService";
import { useExamTimer } from "../../shared/providers/ExamTimerProvider";
import { useWebcam } from "../../shared/providers/WebcamProvider";
import { useExamMonitor } from "../../shared/providers/ExamMonitorProvider";
import { useFeedback } from "../../shared/providers/FeedbackProvider";
import type { AnswerSubmissionDTO } from "../../shared/dtos/attempt.dto";

export const StudentStandardExamPage = () => {
  const { examId } = useParams();
  const navigate = useNavigate();
  const { timeRemaining, startTimer, formatTime } = useExamTimer();
  const { stopWebcam, isWebcamEnabled } = useWebcam();
  const {
    tabSwitches,
    hasExitedFullscreen,
    requestFullscreen,
    resetMonitoring,
  } = useExamMonitor();
  const { data: exam, isLoading, error } = useExam(examId || "");
  const submitExamMutation = useSubmitExam();
  const { showSnackbar } = useFeedback();
  const [answers, setAnswers] = useState<Record<string, any>>({});
  const [flaggedQuestions, setFlaggedQuestions] = useState<Set<string>>(
    new Set()
  );
  const [submitDialogOpen, setSubmitDialogOpen] = useState(false);
  const [startTime] = useState<string>(new Date().toISOString());
  const questionRefs = useRef<Record<string, HTMLDivElement | null>>({});

  const shakeAnimation = `
    @keyframes shake {
      0%, 100% { transform: rotate(0deg) translateY(0); }
      10%, 30%, 50%, 70%, 90% { transform: rotate(-10deg) translateY(-3px); }
      20%, 40%, 60%, 80% { transform: rotate(10deg) translateY(3px); }
    }
  `;

  // Cleanup webcam on unmount
  useEffect(() => {
    return () => {
      stopWebcam();
    };
  }, [stopWebcam]);

  useEffect(() => {
    if (exam && exam.duration_minutes) {
      // Reset monitoring counters
      resetMonitoring();

      // Request fullscreen mode
      requestFullscreen();

      // Start timer with exam duration
      const durationInSeconds = exam.duration_minutes * 60;
      startTimer(durationInSeconds, handleSubmit);
    }
  }, [exam]);

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

  const handleSubmit = async () => {
    if (!examId) return;

    // Stop webcam
    stopWebcam();

    // Convert answers to AnswerSubmissionDTO format
    const answerSubmissions: AnswerSubmissionDTO[] = Object.entries(
      answers
    ).map(([questionId, value]) => {
      const answer: AnswerSubmissionDTO = {
        question_id: questionId,
      };

      // Find the question to determine its type
      const question = questions.find((q) => q.question_id === questionId);

      // Handle different answer types based on question type
      if (
        question?.question_type === "single_choice" &&
        typeof value === "string"
      ) {
        answer.selected_choices = [value];
      } else if (
        question?.question_type === "multiple_choice" &&
        Array.isArray(value)
      ) {
        answer.selected_choices = value;
      } else if (
        (question?.question_type === "short_answer" ||
          question?.question_type === "essay") &&
        typeof value === "string"
      ) {
        answer.answer_text = value;
      }

      return answer;
    });

    try {
      await submitExamMutation.mutateAsync({
        examId,
        submitData: {
          started_at: startTime,
          cheated: tabSwitches > 0 || hasExitedFullscreen,
          answers: answerSubmissions,
        },
      });

      // Exit fullscreen mode
      if (document.fullscreenElement) {
        document.exitFullscreen().catch(console.error);
      } else if ((document as any).webkitFullscreenElement) {
        (document as any).webkitExitFullscreen();
      }

      navigate(-2);
    } catch (error) {
      console.error("Failed to submit exam:", error);
      showSnackbar({
        message: "Failed to submit exam. Please try again.",
        severity: "error",
      });
    }
  };
  const scrollToQuestion = (questionId: string) => {
    questionRefs.current[questionId]?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  };

  const questions = exam?.questions || [];
  const totalPoints = questions.reduce((sum, q) => sum + q.points, 0);
  const answeredCount = Object.keys(answers).length;

  if (isLoading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "100vh",
        }}
      >
        <Typography>Loading exam...</Typography>
      </Box>
    );
  }

  if (error || !exam) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "100vh",
        }}
      >
        <Typography color="error">Failed to load exam</Typography>
      </Box>
    );
  }

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
            {exam.title}
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

        {/* Progress */}
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
              {answeredCount} / {questions.length}
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
            <Typography
              variant="body2"
              fontWeight="bold"
              color={tabSwitches > 0 ? "error.main" : "inherit"}
            >
              {tabSwitches}
            </Typography>
          </Box>
          <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}>
            <Typography variant="body2" color="text.secondary">
              Face Detection:
            </Typography>
            <Typography
              variant="body2"
              fontWeight="bold"
              color={isWebcamEnabled ? "success.main" : "text.secondary"}
            >
              {isWebcamEnabled ? "Yes" : "No"}
            </Typography>
          </Box>
          <Box sx={{ display: "flex", justifyContent: "space-between" }}>
            <Typography variant="body2" color="text.secondary">
              Keep Fullscreen mode:
            </Typography>
            <Typography
              variant="body2"
              fontWeight="bold"
              color={hasExitedFullscreen ? "error.main" : "success.main"}
            >
              {hasExitedFullscreen ? "No" : "Yes"}
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
            {questions.map((question, index) => {
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
          disabled={submitExamMutation.isPending}
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
          {submitExamMutation.isPending ? "Submitting..." : "Submit Exam"}
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
        {questions.map((question, index) => (
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
            {answeredCount} out of {questions.length} questions.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => setSubmitDialogOpen(false)}
            disabled={submitExamMutation.isPending}
          >
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            variant="contained"
            color="success"
            disabled={submitExamMutation.isPending}
          >
            {submitExamMutation.isPending ? "Submitting..." : "Submit"}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};
