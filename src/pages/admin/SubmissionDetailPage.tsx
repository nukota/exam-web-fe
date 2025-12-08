import { useNavigate, useParams } from "react-router-dom";
import { Box, Typography, IconButton, Button } from "@mui/material";
import { ArrowLeft, Save } from "lucide-react";
import { Layout } from "../../components/common";
import { QuestionItem } from "../../components/admin/items";
import { CodingProblem } from "../../components/admin/items";
import { SubmissionInfo } from "../../components/admin/SubmissionInfo";
import {
  useSubmissionReview,
  useGradeSubmission,
} from "../../services/attemptsService";
import { useFeedback } from "../../shared/providers/FeedbackProvider";
import type { Answer } from "../../shared/dtos";
import { useRef, useState } from "react";

export const AdminSubmissionDetailPage = ({ grading = false }) => {
  const { submissionId } = useParams();
  const navigate = useNavigate();
  const { showSnackbar } = useFeedback();
  const questionRefs = useRef<Record<string, HTMLDivElement | null>>({});
  const [scores, setScores] = useState<Record<string, number>>({});

  const {
    data: submissionData,
    isLoading,
    error,
  } = useSubmissionReview(submissionId || "");
  const gradeSubmissionMutation = useGradeSubmission();

  const handleScoreChange = (questionId: string, score: number) => {
    setScores((prev) => ({ ...prev, [questionId]: score }));
  };

  const handleSaveGrades = async () => {
    if (!submissionId) return;

    try {
      await gradeSubmissionMutation.mutateAsync({
        attemptId: submissionId,
        gradeData: {
          question_grades: Object.entries(scores).map(
            ([question_id, score]) => ({
              question_id,
              score,
            })
          ),
        },
      });

      showSnackbar({
        message: "Grades saved successfully!",
        severity: "success",
      });
      navigate(-1);
    } catch (error) {
      console.error("Failed to save grades:", error);
      showSnackbar({
        message: "Failed to save grades. Please try again.",
        severity: "error",
      });
    }
  };

  if (isLoading) {
    return (
      <Layout>
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            minHeight: "100vh",
          }}
        >
          <Typography>Loading submission...</Typography>
        </Box>
      </Layout>
    );
  }

  if (error || !submissionData) {
    return (
      <Layout>
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            minHeight: "100vh",
          }}
        >
          <Typography color="error">Failed to load submission</Typography>
        </Box>
      </Layout>
    );
  }

  const questions = grading
    ? submissionData.questions.filter((q) => q.question_type === "essay")
    : submissionData.questions;
  console.log("Questions to display:", questions);

  const answers = submissionData.questions.reduce((acc, question) => {
    // Extract answer data from question object
    const answerData: Answer = {
      answer_id: "", // Not provided in this response
      attempt_id: submissionData.attempt_id,
      question_id: question.question_id,
      answer_text: (question as any).answer_text,
      selected_choices: (question as any).selected_choices,
      score: (question as any).score,
    };
    acc[question.question_id] = answerData;
    return acc;
  }, {} as Record<string, Answer>);
  console.log("Answers available:", answers);

  const scrollToQuestion = (questionId: string) => {
    questionRefs.current[questionId]?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  };

  return (
    <Layout>
      <Box
        sx={{
          display: "flex",
          height: "calc(100vh - 112px)",
        }}
      >
        {/* Left Section - Questions */}
        <Box
          sx={{
            flex: 1,
            maxWidth: { xs: "100%", lg: "60%", xl: "50%" },
            overflowY: "auto",
            display: "flex",
            flexDirection: "column",
            bgcolor: "white",
            borderRadius: 2,
            gap: 3,
            p: 3,
            pr: 2,
            scrollbarWidth: "revert",
            scrollbarColor: "rgba(0,0,0,0.05) transparent",
          }}
        >
          {/* Header */}
          <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 4 }}>
            <IconButton onClick={() => navigate(-1)}>
              <ArrowLeft size={20} color="black" />
            </IconButton>
            <Typography variant="h5" fontWeight="bold">
              {grading ? "Grading Submission" : "Submission Review"}
            </Typography>
          </Box>

          {/* Questions and Answers */}
          {questions.map((question, index) => {
            const answer = answers[question.question_id];
            if (!answer) return null;

            // Use CodingProblem for coding questions, QuestionItem for others
            if (question.question_type === "coding") {
              return (
                <CodingProblem
                  key={question.question_id}
                  question={question}
                  answer={answer}
                  index={index}
                  isFlagged={question.is_flagged || false}
                  questionRef={(el: HTMLDivElement | null) => {
                    questionRefs.current[question.question_id] = el;
                  }}
                  grading={grading}
                  onScoreChange={handleScoreChange}
                />
              );
            } else {
              return (
                <QuestionItem
                  key={question.question_id}
                  question={question}
                  answer={answer}
                  index={index}
                  isFlagged={question.is_flagged || false}
                  questionRef={(el: HTMLDivElement | null) => {
                    questionRefs.current[question.question_id] = el;
                  }}
                  grading={grading}
                  onScoreChange={handleScoreChange}
                />
              );
            }
          })}

          {/* Save Button for Grading Mode */}
          {grading && (
            <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
              <Button
                variant="contained"
                startIcon={<Save size={20} />}
                onClick={handleSaveGrades}
                disabled={gradeSubmissionMutation.isPending}
                sx={{
                  fontWeight: "bold",
                  backgroundColor: "grey.300",
                  color: "grey.800",
                }}
              >
                {gradeSubmissionMutation.isPending
                  ? "Saving..."
                  : "Save Grades"}
              </Button>
            </Box>
          )}
        </Box>

        {/* Right Section - Submission Info (Sticky) */}
        <SubmissionInfo
          submissionData={submissionData}
          questions={questions}
          answers={answers}
          grading={grading}
          scrollToQuestion={scrollToQuestion}
        />
      </Box>
    </Layout>
  );
};
