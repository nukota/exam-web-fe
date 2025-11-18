import {
  Box,
  Typography,
  Radio,
  RadioGroup,
  FormControlLabel,
  Checkbox,
  FormGroup,
  TextField,
  IconButton,
} from "@mui/material";
import { Flag } from "lucide-react";

interface Choice {
  choice_id: string;
  choice_text: string;
}

interface QuestionProps {
  question: {
    question_id: string;
    question_text: string;
    question_type: string;
    points: number;
    choices?: Choice[];
  };
  index: number;
  answer: any;
  isFlagged: boolean;
  onAnswerChange: (questionId: string, value: any) => void;
  onToggleFlag: (questionId: string) => void;
  questionRef?: (el: HTMLDivElement | null) => void;
}

export const Question = ({
  question,
  index,
  answer,
  isFlagged,
  onAnswerChange,
  onToggleFlag,
  questionRef,
}: QuestionProps) => {
  const getChoiceLabel = (choiceIndex: number) => {
    return String.fromCharCode(65 + choiceIndex); // A, B, C, D, etc.
  };

  return (
    <Box ref={questionRef} sx={{ mb: 4, position: "relative" }}>
      {/* Question Text - Bordered Container */}
      <Box
        sx={{
          p: 2,
          pt: 4,
          border: "1px solid",
          borderColor: "primary.main",
          borderRadius: 1,
          mb: 2,
          bgcolor: "rgba(227, 193, 0, 0.05)",
          position: "relative",
        }}
      >
        {/* Flag Button with Question Number - Absolutely Positioned */}
        <Box
          sx={{
            position: "absolute",
            top: "-20px",
            left: "20px",
            display: "flex",
            alignItems: "center",
            gap: 1,
            px: 2,
            py: 0.5,
            borderRadius: 1,
            background: "linear-gradient(to right, #e3c100, #f5d700)",
            zIndex: 1,
          }}
        >
          <IconButton
            size="small"
            onClick={() => onToggleFlag(question.question_id)}
            sx={{
              color: "black",
              p: 0.5,
              "&:hover": {
                color: "grey.700",
              },
            }}
          >
            <Flag size={16} fill={isFlagged ? "currentColor" : "none"} />
          </IconButton>
          <Typography variant="body2" fontWeight="medium">
            Question {index + 1} ({question.points} pts)
          </Typography>
        </Box>

        <Typography variant="body1" sx={{ textAlign: "left" }}>
          {question.question_text}
        </Typography>
      </Box>

      {/* Answer Options Based on Question Type */}
      {question.question_type === "single_choice" && (
        <Box>
          <RadioGroup
            value={answer || ""}
            onChange={(e) =>
              onAnswerChange(question.question_id, e.target.value)
            }
          >
            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" },
                gap: 1,
              }}
            >
              {question.choices?.map((choice, idx) => (
                <Box
                  key={choice.choice_id}
                  sx={{
                    border: "none",
                    borderRadius: 1,
                    bgcolor:
                      answer === choice.choice_id ? "grey.300" : "grey.100",
                    px: 0,
                    py: 0,
                    transition: "all 0.15s ease-in-out",
                    "&:hover": {
                      bgcolor:
                        answer === choice.choice_id ? "grey.400" : "grey.200",
                    },
                  }}
                >
                  <FormControlLabel
                    value={choice.choice_id}
                    control={<Radio color="default" />}
                    label={
                      <Box
                        sx={{ display: "flex", alignItems: "center", gap: 1 }}
                      >
                        <Typography variant="body2" fontWeight="bold">
                          {getChoiceLabel(idx)}
                        </Typography>
                        <Typography variant="body2">
                          {choice.choice_text}
                        </Typography>
                      </Box>
                    }
                    sx={{ m: 0, p: 1.5, width: "100%" }}
                  />
                </Box>
              ))}
            </Box>
          </RadioGroup>
        </Box>
      )}

      {question.question_type === "multiple_choice" && (
        <Box>
          <FormGroup>
            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" },
                gap: 1,
              }}
            >
              {question.choices?.map((choice, idx) => {
                const isChecked = (answer || []).includes(choice.choice_id);
                return (
                  <Box
                    key={choice.choice_id}
                    sx={{
                      border: "none",
                      borderRadius: 1,
                      bgcolor: isChecked ? "grey.300" : "grey.100",
                      px: 0,
                      py: 0,
                      transition: "all 0.15s ease-in-out",
                      "&:hover": {
                        bgcolor: isChecked ? "grey.400" : "grey.200",
                      },
                    }}
                  >
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={isChecked}
                          onChange={(e) => {
                            const current = answer || [];
                            const newValue = e.target.checked
                              ? [...current, choice.choice_id]
                              : current.filter(
                                  (id: string) => id !== choice.choice_id
                                );
                            onAnswerChange(question.question_id, newValue);
                          }}
                          color="default"
                        />
                      }
                      label={
                        <Box
                          sx={{ display: "flex", alignItems: "center", gap: 1 }}
                        >
                          <Typography variant="body2" fontWeight="bold">
                            {getChoiceLabel(idx)}
                          </Typography>
                          <Typography
                            variant="body2"
                            sx={{
                              fontWeight: isChecked ? "bold" : "normal",
                            }}
                          >
                            {choice.choice_text}
                          </Typography>
                        </Box>
                      }
                      sx={{ m: 0, p: 1.5, width: "100%" }}
                    />
                  </Box>
                );
              })}
            </Box>
          </FormGroup>
        </Box>
      )}

      {question.question_type === "short_answer" && (
        <TextField
          fullWidth
          variant="standard"
          placeholder="Type your answer here"
          value={answer || ""}
          onChange={(e) => onAnswerChange(question.question_id, e.target.value)}
          InputProps={{
            disableUnderline: true,
            sx: {
              bgcolor: "grey.100",
              borderRadius: 1,
              border: "none",
              px: 2,
              py: 1.5,
            },
          }}
        />
      )}

      {question.question_type === "essay" && (
        <TextField
          fullWidth
          multiline
          rows={6}
          variant="standard"
          placeholder="Write your essay here..."
          value={answer || ""}
          onChange={(e) => onAnswerChange(question.question_id, e.target.value)}
          InputProps={{
            disableUnderline: true,
            sx: {
              bgcolor: "grey.100",
              borderRadius: 1,
              border: "none",
              px: 2,
              py: 1.5,
            },
          }}
        />
      )}
    </Box>
  );
};
