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
import { Timer, Send, Code, Check } from "@mui/icons-material";
import { useExamTimer } from "../../shared/providers/ExamTimerProvider";
import { useWebcam } from "../../shared/providers/WebcamProvider";
import { useExamMonitor } from "../../shared/providers/ExamMonitorProvider";
import { useExam } from "../../services/examsService";
import { useSubmitExam } from "../../services/attemptsService";
import { useFeedback } from "../../shared/providers/FeedbackProvider";
import { Card } from "../../components/common";
import type { AnswerSubmissionDTO } from "../../shared/dtos/attempt.dto";

export const StudentCodingExamPage = () => {
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
  const [completedQuestions, setCompletedQuestions] = useState<Set<string>>(
    new Set()
  );
  const [submitDialogOpen, setSubmitDialogOpen] = useState(false);
  const [startTime] = useState<string>(new Date().toISOString());

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
      // Only initialize monitoring and fullscreen on first load
      // Don't reset when navigating back from CodeCompilerPage
      const hasInitialized = localStorage.getItem(`exam_${examId}_initialized`);

      if (!hasInitialized) {
        // Reset monitoring counters
        resetMonitoring();

        // Request fullscreen mode
        requestFullscreen();

        // Start timer with exam duration
        const durationInSeconds = exam.duration_minutes * 60;
        startTimer(durationInSeconds, handleSubmit);

        // Mark as initialized
        localStorage.setItem(`exam_${examId}_initialized`, "true");
      }
    }
  }, [exam]);

  // Check for completed questions whenever localStorage might change
  const checkCompletedQuestions = () => {
    const questions = exam?.questions || [];
    const completed = new Set<string>();
    questions.forEach((question) => {
      // Check if any language has code saved for this question
      const languages = question.programming_languages || ["python"];
      const hasCode = languages.some((lang) => {
        const savedCode = localStorage.getItem(
          `code_${question.question_id}_${lang}`
        );
        return savedCode && savedCode.trim() !== "";
      });

      if (hasCode) {
        completed.add(question.question_id);
      }
    });
    setCompletedQuestions(completed);
  };

  useEffect(() => {
    checkCompletedQuestions();
  }, [examId, exam]);

  // Listen for storage changes to update completion status in real-time
  useEffect(() => {
    const handleStorageChange = () => {
      checkCompletedQuestions();
    };
    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  const handleSubmit = async () => {
    if (!examId) return;

    // Stop webcam
    stopWebcam();

    const questions = exam?.questions || [];

    // Collect all saved code from localStorage for all questions and all languages
    const answerSubmissions: AnswerSubmissionDTO[] = questions.map(
      (question) => {
        const languages = question.programming_languages || ["python"];
        const savedLanguage =
          localStorage.getItem(`language_${question.question_id}`) ||
          languages[0];
        const code =
          localStorage.getItem(
            `code_${question.question_id}_${savedLanguage}`
          ) || "";

        return {
          question_id: question.question_id,
          answer_text: code,
          programming_language: savedLanguage,
        };
      }
    );

    try {
      await submitExamMutation.mutateAsync({
        examId,
        submitData: {
          started_at: startTime,
          cheated: tabSwitches > 0 || hasExitedFullscreen,
          answers: answerSubmissions,
        },
      });

      // Clear all code from localStorage after successful submission
      questions.forEach((question) => {
        const languages = question.programming_languages || ["python"];
        languages.forEach((lang) => {
          localStorage.removeItem(`code_${question.question_id}_${lang}`);
        });
        localStorage.removeItem(`language_${question.question_id}`);
      });

      // Clear initialization flag
      localStorage.removeItem(`exam_${examId}_initialized`);

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

  const handleQuestionClick = (questionId: string) => {
    navigate(`/student/exam/coding/${examId}/compiler/${questionId}`);
  };

  const questions = exam?.questions || [];
  const totalPoints = questions.reduce((sum, q) => sum + q.points, 0);
  const completedCount = completedQuestions.size;

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
              {completedCount} / {questions.length}
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
            {questions.map((question, index) => {
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
          {questions.map((question, index) => (
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
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <Typography variant="h6" fontWeight="bold">
                      <span
                        dangerouslySetInnerHTML={{
                          __html: question.title || `Question ${index + 1}`,
                        }}
                      />{" "}
                      ({question.points} pts)
                    </Typography>
                    {completedQuestions.has(question.question_id) && (
                      <Check sx={{ color: "success.main", fontSize: 20 }} />
                    )}
                  </Box>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ mb: 2, mt: 1 }}
                  >
                    <span
                      dangerouslySetInnerHTML={{
                        __html:
                          question.question_text || "Solve this coding problem",
                      }}
                    />
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
            {completedCount} out of {questions.length} questions.
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
