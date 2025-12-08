import React from "react";
import {
  Box,
  Typography,
  TextField,
  Button,
  IconButton,
  Checkbox,
  FormControlLabel,
  FormGroup,
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from "@mui/material";
import {
  Add,
  Delete,
  ArrowUpward,
  ArrowDownward,
  ExpandMore,
} from "@mui/icons-material";
import TiptapEditor from "../tiptap-editor/TiptapEditor";
import type { UpdateQuestionDTO } from "../../../shared/dtos";
import type { ProgrammingLanguage } from "../../../shared/enum";

interface EditableCodingQuestionProps {
  question: UpdateQuestionDTO;
  questionIndex: number;
  availableLanguages: ProgrammingLanguage[];
  onQuestionChange: (field: string, value: any) => void;
  onLanguageToggle: (language: ProgrammingLanguage) => void;
  onTemplateChange: (language: string, value: string) => void;
  onAddTestCase: () => void;
  onRemoveTestCase: (testCaseIndex: number) => void;
  onTestCaseChange: (testCaseIndex: number, field: string, value: any) => void;
  onMoveUp: () => void;
  onMoveDown: () => void;
  onRemove: () => void;
}

export const EditableCodingQuestion: React.FC<EditableCodingQuestionProps> = ({
  question,
  questionIndex,
  availableLanguages,
  onQuestionChange,
  onLanguageToggle,
  onTemplateChange,
  onAddTestCase,
  onRemoveTestCase,
  onTestCaseChange,
  onMoveUp,
  onMoveDown,
  onRemove,
}) => {
  const [pointsInput, setPointsInput] = React.useState<string>(String(question.points || 10));

  React.useEffect(() => {
    setPointsInput(String(question.points || 10));
  }, [question.points]);

  return (
    <Box sx={{ mb: 4 }}>
      {/* Question Header */}
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
        <Typography variant="h6" fontWeight="bold">
          Question {questionIndex + 1}
        </Typography>
        <Box sx={{ display: "flex", gap: 1 }}>
          <IconButton size="small" onClick={onMoveUp}>
            <ArrowUpward fontSize="small" />
          </IconButton>
          <IconButton size="small" onClick={onMoveDown}>
            <ArrowDownward fontSize="small" />
          </IconButton>
          <IconButton size="small" onClick={onRemove}>
            <Delete sx={{ fontSize: "1.25rem" }} />
          </IconButton>
        </Box>
      </Box>

      {/* Title and Points */}
      <Box sx={{ display: "flex", gap: 2, mb: 0 }}>
        <TextField
          size="small"
          fullWidth
          label="Question Title"
          value={question.title || ""}
          onChange={(e) => onQuestionChange("title", e.target.value)}
          placeholder="e.g., Two Sum Problem"
        />
        <TextField
          size="small"
          label="Points"
          type="number"
          value={pointsInput}
          onChange={(e) => {
            const value = e.target.value;
            setPointsInput(value);
            const parsed = parseInt(value);
            if (!isNaN(parsed) && parsed > 0) {
              onQuestionChange("points", parsed);
            }
          }}
          error={!pointsInput || parseInt(pointsInput) <= 0}
          sx={{ width: 100 }}
        />
      </Box>

      {/* Problem Description */}
      <Box sx={{ mb: 2 }}>
        <TiptapEditor
          value={question.question_text || ""}
          onChange={(html) => onQuestionChange("question_text", html)}
        />
      </Box>

      {/* Programming Languages */}
      <Box sx={{ mb: 2 }}>
        <Typography
          variant="body1"
          fontWeight={600}
          gutterBottom
          sx={{ textAlign: "left" }}
        >
          Programming Languages
        </Typography>
        <FormGroup row>
          {availableLanguages.map((lang) => (
            <FormControlLabel
              key={lang}
              control={
                <Checkbox
                  size="small"
                  checked={
                    question.programming_languages?.includes(lang) || false
                  }
                  onChange={() => onLanguageToggle(lang)}
                />
              }
              label={lang.charAt(0).toUpperCase() + lang.slice(1)}
            />
          ))}
        </FormGroup>
      </Box>

      {/* Code Templates - Collapsible */}
      {question.programming_languages &&
        question.programming_languages.length > 0 && (
          <Accordion
            defaultExpanded
            sx={{
              mb: 2,
              boxShadow: "none",
              border: 1,
              borderColor: "divider",
              borderRadius: 1,
              "&:before": {
                display: "none",
              },
            }}
          >
            <AccordionSummary
              expandIcon={<ExpandMore />}
              sx={{
                "& .MuiAccordionSummary-content": {
                  alignItems: "center",
                },
              }}
            >
              <Typography variant="body1" fontWeight={600}>
                Code Templates
              </Typography>
            </AccordionSummary>
            <AccordionDetails>
              {question.programming_languages.map((lang) => (
                <Box key={lang} sx={{ mb: 2 }}>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    gutterBottom
                    sx={{ display: "block", textAlign: "left" }}
                  >
                    {lang.charAt(0).toUpperCase() + lang.slice(1)}
                  </Typography>
                  <TextField
                    size="small"
                    fullWidth
                    multiline
                    rows={4}
                    value={question.coding_template?.[lang] || ""}
                    onChange={(e) => onTemplateChange(lang, e.target.value)}
                    placeholder={`Enter ${lang} template...`}
                    sx={{
                      "& textarea": {
                        fontFamily: "monospace",
                        fontSize: "0.75rem",
                        lineHeight: 1.5,
                      },
                    }}
                  />
                </Box>
              ))}
            </AccordionDetails>
          </Accordion>
        )}

      {/* Test Cases - Collapsible */}
      <Accordion
        defaultExpanded
        sx={{
          mb: 2,
          boxShadow: "none",
          border: 1,
          borderColor: "divider",
          borderRadius: 1,
          "&:before": {
            display: "none",
          },
        }}
      >
        <AccordionSummary
          expandIcon={<ExpandMore />}
          sx={{
            "& .MuiAccordionSummary-content": {
              alignItems: "center",
            },
          }}
        >
          <Typography variant="body1" fontWeight={600}>
            Test Cases
          </Typography>
        </AccordionSummary>
        <AccordionDetails>
          {question.coding_test_cases?.map((testCase, tcIndex) => (
            <Box
              key={tcIndex}
              sx={{
                p: 1,
                mb: 2,
                borderLeft: 4,
                borderLeftColor: "primary.main",
                borderRadius: 1,
              }}
            >
              <Box sx={{ display: "flex", gap: 1, alignItems: "center" }}>
                <Typography
                  variant="body1"
                  fontWeight="bold"
                  sx={{ minWidth: "20px" }}
                >
                  {tcIndex + 1}.
                </Typography>
                <TextField
                  size="small"
                  fullWidth
                  label="Input Data"
                  multiline
                  rows={2}
                  value={testCase.input_data}
                  onChange={(e) =>
                    onTestCaseChange(tcIndex, "input_data", e.target.value)
                  }
                  sx={{
                    fontFamily: "monospace",
                    "& textarea": {
                      fontFamily: "monospace",
                    },
                  }}
                />
                <TextField
                  size="small"
                  fullWidth
                  label="Expected Output"
                  multiline
                  rows={2}
                  value={testCase.expected_output}
                  onChange={(e) =>
                    onTestCaseChange(tcIndex, "expected_output", e.target.value)
                  }
                  sx={{
                    fontFamily: "monospace",
                    "& textarea": {
                      fontFamily: "monospace",
                    },
                  }}
                />
                <IconButton
                  size="small"
                  onClick={() => onRemoveTestCase(tcIndex)}
                  sx={{ mt: 1 }}
                >
                  <Delete fontSize="small" />
                </IconButton>
              </Box>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "flex-end",
                  alignItems: "center",
                }}
              >
                <FormControlLabel
                  control={
                    <Checkbox
                      size="small"
                      checked={testCase.is_hidden}
                      onChange={(e) =>
                        onTestCaseChange(tcIndex, "is_hidden", e.target.checked)
                      }
                    />
                  }
                  label={
                    <Typography variant="body2" color="text.secondary">
                      Hidden
                    </Typography>
                  }
                />
              </Box>
            </Box>
          ))}
          <Button
            size="small"
            startIcon={<Add />}
            onClick={onAddTestCase}
            sx={{ mt: 1 }}
          >
            Add Test Case
          </Button>
        </AccordionDetails>
      </Accordion>
    </Box>
  );
};
