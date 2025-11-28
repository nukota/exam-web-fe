import {
  Box,
  Typography,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  IconButton,
  ButtonGroup,
} from "@mui/material";
import {
  AddCircleOutlineRounded,
  Delete,
  Remove,
  KeyboardArrowUp,
  KeyboardArrowDown,
} from "@mui/icons-material";
import TiptapEditor from "../tiptap-editor/TiptapEditor";

import type { UpdateQuestionDTO } from "../../../shared/dtos";

interface EditableQuestionProps {
  question: UpdateQuestionDTO;
  questionIndex: number;
  onQuestionChange: (index: number, field: string, value: any) => void;
  onRemoveQuestion: (index: number) => void;
  onMoveUp: (index: number) => void;
  onMoveDown: (index: number) => void;
  onAddChoice: (questionIndex: number) => void;
  onRemoveChoice: (questionIndex: number, choiceIndex: number) => void;
  onChoiceChange: (
    questionIndex: number,
    choiceIndex: number,
    field: string,
    value: any
  ) => void;
}

export const EditableQuestion = ({
  question,
  questionIndex,
  onQuestionChange,
  onRemoveQuestion,
  onMoveUp,
  onMoveDown,
  onAddChoice,
  onRemoveChoice,
  onChoiceChange,
}: EditableQuestionProps) => {
  return (
    <Box sx={{ mb: 6 }}>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          px: 2,
          py: 0.25,
          borderRadius: 1,
          bgcolor: "rgb(227, 193, 0, 0.25)",
        }}
      >
        <Typography sx={{ fontSize: "1.25rem" }} fontWeight="bold">
          Question {questionIndex + 1}
        </Typography>
        <ButtonGroup size="small" variant="outlined">
          <IconButton onClick={() => onMoveUp(questionIndex)}>
            <KeyboardArrowUp />
          </IconButton>
          <IconButton onClick={() => onMoveDown(questionIndex)}>
            <KeyboardArrowDown />
          </IconButton>
          <IconButton onClick={() => onRemoveQuestion(questionIndex)}>
            <Delete sx={{ fontSize: "1.25rem" }} />
          </IconButton>
        </ButtonGroup>
      </Box>

      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          gap: 1,
        }}
      >
        {/* Tiptap Rich Text Editor for Question Text */}
        <TiptapEditor
          value={question.question_text || ""}
          onChange={(value: string) =>
            onQuestionChange(questionIndex, "question_text", value)
          }
          placeholder="Enter your question here..."
        />

        <Box sx={{ display: "flex", gap: 2 }}>
          <FormControl fullWidth>
            <InputLabel>Question Type</InputLabel>
            <Select
              size="small"
              value={question.question_type}
              label="Question Type"
              onChange={(e) =>
                onQuestionChange(questionIndex, "question_type", e.target.value)
              }
              sx={{
                bgcolor: "white",
              }}
            >
              <MenuItem value="single_choice">Single Choice</MenuItem>
              <MenuItem value="multiple_choice">Multiple Choice</MenuItem>
              <MenuItem value="short_answer">Short Answer</MenuItem>
              <MenuItem value="essay">Essay</MenuItem>
            </Select>
          </FormControl>
          <TextField
            size="small"
            label="Points"
            type="number"
            value={question.points}
            onChange={(e) =>
              onQuestionChange(
                questionIndex,
                "points",
                parseFloat(e.target.value)
              )
            }
            sx={{ width: 150 }}
          />
        </Box>

        {/* Choices for Single/Multiple Choice Questions */}
        {(question.question_type === "single_choice" ||
          question.question_type === "multiple_choice") && (
          <Box>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                mb: 1,
              }}
            >
              <Typography variant="subtitle1" fontWeight="bold">
                Choices
              </Typography>
              <IconButton
                size="small"
                onClick={() => onAddChoice(questionIndex)}
                sx={{
                  color: "black",
                }}
              >
                <AddCircleOutlineRounded />
              </IconButton>
            </Box>
            {question.choices?.map((choice, cIndex) => (
              <Box key={cIndex} sx={{ display: "flex", gap: 1, mb: 1 }}>
                <TextField
                  size="small"
                  fullWidth
                  label={`Choice ${cIndex + 1}`}
                  value={choice.choice_text}
                  onChange={(e) =>
                    onChoiceChange(
                      questionIndex,
                      cIndex,
                      "choice_text",
                      e.target.value
                    )
                  }
                />
                <FormControl size="small" sx={{ minWidth: 120 }}>
                  <Select
                    size="small"
                    value={
                      question.correct_answer?.includes(choice.choice_id || "")
                        ? "yes"
                        : "no"
                    }
                    label="Correct?"
                    onChange={(e) => {
                      const isCorrect = e.target.value === "yes";
                      const currentCorrectAnswers =
                        question.correct_answer || [];
                      const choiceId = choice.choice_id || "";

                      let newCorrectAnswers;
                      if (isCorrect) {
                        // Add to correct answers if not already there
                        if (!currentCorrectAnswers.includes(choiceId)) {
                          newCorrectAnswers = [
                            ...currentCorrectAnswers,
                            choiceId,
                          ];
                        } else {
                          newCorrectAnswers = currentCorrectAnswers;
                        }
                      } else {
                        // Remove from correct answers
                        newCorrectAnswers = currentCorrectAnswers.filter(
                          (id) => id !== choiceId
                        );
                      }

                      onQuestionChange(
                        questionIndex,
                        "correct_answer",
                        newCorrectAnswers
                      );
                    }}
                    sx={{
                      bgcolor: "white",
                    }}
                  >
                    <MenuItem value="yes">Correct</MenuItem>
                    <MenuItem value="no">Incorrect</MenuItem>
                  </Select>
                </FormControl>
                {question.choices!.length > 2 && (
                  <IconButton
                    size="small"
                    onClick={() => onRemoveChoice(questionIndex, cIndex)}
                    sx={{
                      color: "black",
                    }}
                  >
                    <Remove fontSize="small" />
                  </IconButton>
                )}
              </Box>
            ))}
          </Box>
        )}

        {/* Multiple Correct Answers for Short Answer Questions */}
        {question.question_type === "short_answer" && (
          <Box>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                mb: 1,
              }}
            >
              <Typography variant="subtitle1" fontWeight="bold">
                Correct Answers
              </Typography>
              <IconButton
                size="small"
                onClick={() => {
                  const currentAnswers = question.correct_answer_text || [];
                  onQuestionChange(questionIndex, "correct_answer_text", [
                    ...currentAnswers,
                    "",
                  ]);
                }}
                sx={{
                  color: "black",
                }}
              >
                <AddCircleOutlineRounded />
              </IconButton>
            </Box>
            {(question.correct_answer_text || [""]).map((answer, aIndex) => (
              <Box key={aIndex} sx={{ display: "flex", gap: 1, mb: 1 }}>
                <TextField
                  size="small"
                  fullWidth
                  label={`Correct Answer ${aIndex + 1}`}
                  placeholder="Enter a correct answer"
                  value={answer}
                  onChange={(e) => {
                    const currentAnswers = question.correct_answer_text || [];
                    const newAnswers = [...currentAnswers];
                    newAnswers[aIndex] = e.target.value;
                    onQuestionChange(
                      questionIndex,
                      "correct_answer_text",
                      newAnswers
                    );
                  }}
                />
                {(question.correct_answer_text?.length || 0) > 1 && (
                  <IconButton
                    size="small"
                    onClick={() => {
                      const currentAnswers = question.correct_answer_text || [];
                      const newAnswers = currentAnswers.filter(
                        (_, i) => i !== aIndex
                      );
                      onQuestionChange(
                        questionIndex,
                        "correct_answer_text",
                        newAnswers.length > 0 ? newAnswers : [""]
                      );
                    }}
                    sx={{
                      color: "black",
                    }}
                  >
                    <Remove fontSize="small" />
                  </IconButton>
                )}
              </Box>
            ))}
          </Box>
        )}
      </Box>
    </Box>
  );
};
