import React, { useState } from "react";
import { Box, Typography, TextField } from "@mui/material";
import { CheckCircle, X, Check, Flag } from "lucide-react";
import type { ReviewQuestionDTO } from "../../../shared/dtos/question.dto";
import type { Answer } from "../../../shared/dtos/answer.dto";

interface QuestionProps {
  question: ReviewQuestionDTO;
  answer: Answer;
  index: number;
  isFlagged?: boolean;
  questionRef?: (el: HTMLDivElement | null) => void;
  grading?: boolean;
  onScoreChange?: (questionId: string, score: number) => void;
}

export const QuestionItem: React.FC<QuestionProps> = ({
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
  const renderChoices = () => {
    if (
      question.question_type === "single_choice" ||
      question.question_type === "multiple_choice"
    ) {
      return (
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: 1,
            mb: 2,
          }}
        >
          {question.choices?.map((choice) => {
            const isSelected = choice.is_chosen;
            const isCorrect = choice.is_correct;

            return (
              <Box
                key={choice.choice_id}
                sx={{
                  p: 1.5,
                  borderRadius: 1,
                  border: "1px solid",
                  borderColor: "grey.300",
                  bgcolor: isSelected ? "grey.300" : "grey.100",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  gap: 1,
                  minHeight: 48,
                }}
              >
                <Typography variant="body2" sx={{ flex: 1, textAlign: "left" }}>
                  {choice.choice_text}
                </Typography>
                <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                  {isSelected && !isCorrect && <X size={20} color="#f44336" />}
                  {isCorrect && <Check size={20} color="#4caf50" />}
                </Box>
              </Box>
            );
          })}
        </Box>
      );
    }
    return null;
  };

  const renderAnswer = () => {
    if (question.question_type === "short_answer") {
      const correctAnswers = question.correct_answer_text || [];
      const isCorrect = correctAnswers.some((correct: string) =>
        answer.answer_text?.toLowerCase().includes(correct.toLowerCase())
      );
      return (
        <Box sx={{ display: "flex", flexDirection: "column", gap: 1, mb: 2 }}>
          {/* Student's Answer */}
          <Box
            sx={{
              p: 1.5,
              borderRadius: 1,
              border: "1px solid",
              borderColor: "grey.300",
              bgcolor: "grey.100",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: 1,
              minHeight: 48,
            }}
          >
            <Typography variant="body2" sx={{ flex: 1, textAlign: "left" }}>
              {answer.answer_text || "(No answer provided)"}
            </Typography>
            {isCorrect && <Check size={20} color="#4caf50" />}
            {!isCorrect && answer.answer_text && (
              <X size={20} color="#f44336" />
            )}
          </Box>

          {/* Correct Answers */}
          {correctAnswers.length > 0 && (
            <Typography
              variant="body2"
              color="text.secondary"
              sx={{ textAlign: "left", mt: 1, pl: 2 }}
            >
              <strong>Accepted Answers:</strong> {correctAnswers.join(", ")}
            </Typography>
          )}
        </Box>
      );
    } else if (question.question_type === "essay") {
      return (
        <Box>
          <Box
            sx={{
              p: 2,
              mb: 2,
              bgcolor: "grey.100",
              borderRadius: 1,
              border: "1px solid",
              borderColor: "grey.300",
              minHeight: 100,
              maxHeight: 300,
              overflowY: "auto",
              textAlign: "left",
            }}
          >
            <Typography variant="body2" sx={{ whiteSpace: "pre-wrap" }}>
              {answer.answer_text || "(No answer provided)"}
            </Typography>
          </Box>
        </Box>
      );
    }
    return null;
  };

  return (
    <Box
      ref={questionRef}
      sx={{
        position: "relative",
      }}
    >
      {/* Question Text - Bordered Container */}
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
        {/* Header with Question Number - Absolutely Positioned */}
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
            Question {index + 1} ({question.points} pts)
          </Typography>
          {isFlagged && <Flag size={16} fill="#000" color="#000" />}
        </Box>

        <Typography variant="body1" sx={{ textAlign: "left" }}>
          {question.question_text}
        </Typography>
      </Box>

      {/* Student's Answer */}
      {question.question_type === "single_choice" ||
      question.question_type === "multiple_choice"
        ? renderChoices()
        : renderAnswer()}

      {/* Grading Section */}
      {grading && question.question_type === "essay" ? (
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
            value={score}
            onChange={(e) => handleScoreChange(e.target.value)}
            inputProps={{
              min: 0,
              max: question.points,
              step: 0.25,
            }}
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
