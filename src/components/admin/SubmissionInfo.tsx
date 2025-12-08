import { Box, Typography } from "@mui/material";
import { User, Award, AlertTriangle } from "lucide-react";

interface SubmissionInfoProps {
  submissionData: any;
  questions: any[];
  answers: Record<string, any>;
  grading: boolean;
  scrollToQuestion: (questionId: string) => void;
}

export const SubmissionInfo = ({
  submissionData,
  questions,
  answers,
  grading,
  scrollToQuestion,
}: SubmissionInfoProps) => {
  const getTotalScore = () => {
    return submissionData.total_score || 0;
  };

  const getMaxScore = () => {
    return submissionData.exam.max_score;
  };

  return (
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
            {submissionData.student.full_name || "Unknown Student"}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {submissionData.student.email}
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
          <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2 }}>
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
              {((getTotalScore() / getMaxScore()) * 100).toFixed(1)}% achieved
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
            {submissionData.submitted_at
              ? new Date(submissionData.submitted_at).toLocaleDateString() +
                " at " +
                new Date(submissionData.submitted_at).toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })
              : "N/A"}
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
            color={submissionData.cheated ? "error.main" : "success.main"}
          >
            {submissionData.cheated ? "Yes" : "No"}
          </Typography>
        </Box>

        {/* Warning if flagged */}
        {submissionData.cheated && (
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
            const isFlagged = question.is_flagged || false;
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
  );
};
