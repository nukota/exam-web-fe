import React, { useState } from "react";
import { Box, Typography, TextField } from "@mui/material";
import { CheckCircle, Flag } from "lucide-react";
import type { ReviewQuestionDTO } from "../../../shared/dtos/question.dto";
import type { Answer } from "../../../shared/dtos/answer.dto";

interface CodingProblemProps {
  question: ReviewQuestionDTO;
  answer: Answer;
  index: number;
  isFlagged?: boolean;
  questionRef?: (el: HTMLDivElement | null) => void;
  grading?: boolean;
  onScoreChange?: (questionId: string, score: number) => void;
}

export const CodingProblem: React.FC<CodingProblemProps> = ({
  question,
  answer,
  index,
  isFlagged = false,
  questionRef,
  grading = false,
  onScoreChange,
}) => {
  const [score, setScore] = useState<number>(answer.score || 0);

  const handleScoreChange = (value: string) => {
    if (value === "") {
      setScore(0);
      if (onScoreChange) {
        onScoreChange(question.question_id, 0);
      }
      return;
    }
    const numValue = parseFloat(value);
    if (!isNaN(numValue) && numValue >= 0 && numValue <= question.points) {
      // Round to nearest 0.25
      const roundedValue = Math.round(numValue * 4) / 4;
      setScore(roundedValue);
      if (onScoreChange) {
        onScoreChange(question.question_id, roundedValue);
      }
    }
  };

  return (
    <Box
      ref={questionRef}
      sx={{
        position: "relative",
      }}
    >
      {/* Problem Text - Bordered Container */}
      <Box
        sx={{
          p: 2,
          pt: 4,
          border: "1px solid",
          borderColor: "primary.main",
          borderRadius: 1,
          mb: 2,
          bgcolor: "#FEFCF2",
          position: "relative",
        }}
      >
        {/* Header with Problem Number - Absolutely Positioned */}
        <Box
          sx={{
            position: "absolute",
            top: "-18px",
            left: "20px",
            display: "flex",
            alignItems: "center",
            gap: 1,
            px: 2,
            py: 0.75,
            borderRadius: 1,
            background: "linear-gradient(to right, #e3c100, #f5d700)",
            zIndex: 1,
          }}
        >
          <Typography variant="body2" fontWeight="medium">
            Problem {index + 1} ({question.points} pts)
          </Typography>
          {isFlagged && <Flag size={16} fill="#000" color="#000" />}
        </Box>

        {/* Problem Title */}
        {question.title && (
          <Typography
            variant="h6"
            fontWeight="bold"
            sx={{ textAlign: "left", mb: 1 }}
          >
            {question.title}
          </Typography>
        )}

        <Typography variant="body1" sx={{ textAlign: "left" }}>
          <span
            dangerouslySetInnerHTML={{
              __html: question.question_text || "Question text not available",
            }}
          />
        </Typography>
      </Box>

      {/* Code Submission */}
      <Box sx={{ mb: 2 }}>
        <Typography
          variant="subtitle2"
          fontWeight="bold"
          sx={{ textAlign: "left", mb: 1 }}
        >
          Submitted Code: {question.programming_language?.toLocaleUpperCase()}
        </Typography>

        <Box
          sx={{
            p: 2,
            bgcolor: "#f5f5f5",
            borderRadius: 1,
            border: "1px solid",
            borderColor: "grey.300",
            fontFamily: "monospace",
            fontSize: "0.875rem",
            lineHeight: 1.5,
            whiteSpace: "pre-wrap",
            maxHeight: 400,
            overflowY: "auto",
            textAlign: "left",
          }}
        >
          {answer.answer_text || "(No code submitted)"}
        </Box>
      </Box>

      {/* Grading Section */}
      {grading ? (
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "flex-end",
            gap: 2,
            mb: 4,
          }}
        >
          <Typography variant="body1">Score:</Typography>
          <TextField
            size="small"
            type="number"
            value={score === 0 ? "" : score}
            onChange={(e) => handleScoreChange(e.target.value)}
            inputProps={{
              min: 0,
              max: question.points,
              step: 0.25,
            }}
            placeholder="0"
          />
          <Typography variant="body2" color="text.secondary">
            / {question.points} points
          </Typography>
        </Box>
      ) : (
        <Box
          sx={{
            display: "flex",
            justifyContent: "flex-end",
            mb: 4,
          }}
        >
          <Typography variant="body2" color="text.secondary">
            {answer.score || 0} / {question.points} points
          </Typography>
          {answer.score === question.points && (
            <CheckCircle size={20} color="#4caf50" />
          )}
        </Box>
      )}
    </Box>
  );
};
