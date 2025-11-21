import { useNavigate } from "react-router-dom";
import { Box, Typography, IconButton, Button } from "@mui/material";
import { ArrowLeft, User, Award, AlertTriangle, Save } from "lucide-react";
import { Layout } from "../../components/common";
import { QuestionItem } from "../../components/admin/items";
import {
  mockQuestionsExam1,
  mockSubmissionDetail,
} from "../../shared/mockdata";
import type { Answer } from "../../shared/dtos";
import { useRef, useState } from "react";

export const AdminSubmissionDetailPage = ({ grading = false }) => {
  const navigate = useNavigate();
  const questionRefs = useRef<Record<string, HTMLDivElement | null>>({});
  const [scores, setScores] = useState<Record<string, number>>({});

  const handleScoreChange = (questionId: string, score: number) => {
    setScores((prev) => ({ ...prev, [questionId]: score }));
  };

  const handleSaveGrades = () => {
    // TODO: Save grades to backend
    console.log("Saving grades:", scores);
    // Navigate back after saving
    navigate(-1);
  };

  // In a real app, fetch submission details from backend
  const submission = mockSubmissionDetail;
  const allQuestions = mockQuestionsExam1;
  const questions = grading
    ? allQuestions.filter((q) => q.question_type === "essay")
    : allQuestions;
  const flaggedQuestions = new Set(submission.flagged_questions || []);

  const answers = submission.answers.reduce((acc, answer) => {
    acc[answer.question_id] = answer;
    return acc;
  }, {} as Record<string, Answer>);

  const scrollToQuestion = (questionId: string) => {
    questionRefs.current[questionId]?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  };

  const getTotalScore = () => {
    return Object.values(answers).reduce(
      (sum, answer) => sum + (answer.score || 0),
      0
    );
  };

  const getMaxScore = () => {
    return questions.reduce((sum, q) => sum + q.points, 0);
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

            return (
              <QuestionItem
                key={question.question_id}
                question={question}
                answer={answer}
                index={index}
                isFlagged={flaggedQuestions.has(question.question_id)}
                questionRef={(el: HTMLDivElement | null) => {
                  questionRefs.current[question.question_id] = el;
                }}
                grading={grading}
                onScoreChange={handleScoreChange}
              />
            );
          })}

          {/* Save Button for Grading Mode */}
          {grading && (
            <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
              <Button
                variant="contained"
                startIcon={<Save size={20} />}
                onClick={handleSaveGrades}
                sx={{
                  fontWeight: "bold",
                  backgroundColor: "grey.300",
                  color: "grey.800",
                }}
              >
                Save Grades
              </Button>
            </Box>
          )}
        </Box>

        {/* Right Section - Submission Info (Sticky) */}
        <Box
          sx={{
            width: 400,
            px: 2,
            borderLeft: "1px solid",
            borderColor: "divider",
            display: "flex",
            flexDirection: "column",
            gap: 1,
            overflowY: "auto",
          }}
        >
          {/* Student Info */}
          <Box
            sx={{
              p: 2,
              bgcolor: "white",
              borderRadius: 2,
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2 }}>
              <User size={20} />
              <Typography variant="subtitle2" fontWeight="bold">
                Student
              </Typography>
            </Box>
            <Box sx={{ textAlign: "left" }}>
              <Typography variant="body1" fontWeight="bold" gutterBottom>
                {submission.student_name}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {submission.student_email}
              </Typography>
            </Box>
          </Box>

          {/* Score Info */}
          {!grading && (
            <Box
              sx={{
                p: 2,
                bgcolor: "white",
                borderRadius: 2,
              }}
            >
              <Box
                sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2 }}
              >
                <Award size={20} />
                <Typography variant="subtitle2" fontWeight="bold">
                  Score
                </Typography>
              </Box>
              <Box sx={{ textAlign: "left" }}>
                <Typography variant="h5" fontWeight="bold" color="primary">
                  {getTotalScore()} / {getMaxScore()}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {((getTotalScore() / getMaxScore()) * 100).toFixed(1)}%
                  achieved
                </Typography>
              </Box>
            </Box>
          )}

          {/* Submission Time & Question Summary */}
          <Box
            sx={{
              p: 2,
              gap: 1,
              display: "flex",
              flexDirection: "column",
              bgcolor: "white",
              borderRadius: 2,
            }}
          >
            <Typography
              variant="h6"
              fontWeight="bold"
              gutterBottom
              sx={{ textAlign: "left" }}
            >
              Details
            </Typography>
            <Box sx={{ display: "flex", justifyContent: "space-between" }}>
              <Typography variant="body2" color="text.secondary">
                Submitted:
              </Typography>
              <Typography variant="body2" fontWeight="bold">
                {new Date(submission.submitted_at).toLocaleDateString()} at{" "}
                {new Date(submission.submitted_at).toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </Typography>
            </Box>
            <Box sx={{ display: "flex", justifyContent: "space-between" }}>
              <Typography variant="body2" color="text.secondary">
                Questions:
              </Typography>
              <Typography variant="body2" fontWeight="bold">
                {questions.length} ({getMaxScore()} pts)
              </Typography>
            </Box>
            <Box sx={{ display: "flex", justifyContent: "space-between" }}>
              <Typography variant="body2" color="text.secondary">
                Cheat detected:
              </Typography>
              <Typography
                variant="body2"
                fontWeight="bold"
                color={submission.cheated ? "error.main" : "success.main"}
              >
                {submission.cheated ? "Yes" : "No"}
              </Typography>
            </Box>

            {/* Warning if flagged */}
            {submission.cheated && (
              <Box
                sx={{
                  p: 2,
                  bgcolor: "#fef2f2",
                  borderRadius: 2,
                  textAlign: "left",
                }}
              >
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <AlertTriangle size={16} color="#d32f2f" />
                  <Typography variant="body2" color="error">
                    Suspicious activity detected during exam
                  </Typography>
                </Box>
              </Box>
            )}
          </Box>

          {/* Question Grid Map */}
          <Box
            sx={{
              p: 2,
              bgcolor: "white",
              borderRadius: 2,
            }}
          >
            <Typography
              variant="subtitle2"
              fontWeight="bold"
              gutterBottom
              sx={{ textAlign: "left" }}
            >
              Question Map
            </Typography>
            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: "repeat(9, 1fr)",
                gap: 0.5,
              }}
            >
              {questions.map((question, index) => {
                const answer = answers[question.question_id];
                const hasFullScore = answer?.score === question.points;
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
                      bgcolor: hasFullScore ? " #d5f2d5" : "grey.100",
                      borderRadius: "4px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      "&:hover": {
                        bgcolor: hasFullScore ? "#c8e6c9" : "grey.200",
                      },
                    }}
                  >
                    <Typography variant="caption" fontWeight="bold">
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
                          borderTop: "8px solid",
                          borderTopColor: "primary.main",
                          borderLeft: "8px solid transparent",
                        }}
                      />
                    )}
                  </Box>
                );
              })}
            </Box>
          </Box>
        </Box>
      </Box>
    </Layout>
  );
};
