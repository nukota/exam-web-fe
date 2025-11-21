import { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Box,
  Typography,
  TextField,
  Button,
  IconButton,
  Checkbox,
} from "@mui/material";
import { Add, ContentCopy } from "@mui/icons-material";
import { Layout } from "../../components/common";
import Card from "../../components/common/Card";
import { EditableQuestion } from "../../components/admin/items/EditableQuestion";
import { useFeedback } from "../../shared/providers/FeedbackProvider";
import type { UpdateExamDto, CreateQuestionDto } from "../../shared/dtos";
import { mockExam } from "../../shared/mockdata";

export const AdminEditExamPage = () => {
  const { examId } = useParams();
  const navigate = useNavigate();
  const { showSnackbar } = useFeedback();
  const [exam, setExam] = useState<Partial<UpdateExamDto>>({});
  const [questions, setQuestions] = useState<Partial<CreateQuestionDto>[]>([]);
  const [hasEndTime, setHasEndTime] = useState<boolean>(true);
  const questionRefs = useRef<Record<number, HTMLDivElement | null>>({});

  useEffect(() => {
    // In a real app, fetch exam by ID
    setExam({
      title: mockExam.title,
      description: mockExam.description,
      type: mockExam.type,
      access_code: mockExam.access_code,
      duration_minutes: mockExam.duration_minutes,
      start_at: mockExam.start_at?.substring(0, 16),
      end_at: mockExam.end_at?.substring(0, 16),
    });
    // Set hasEndTime based on whether end_at exists
    setHasEndTime(!!mockExam.end_at);
    // Load existing questions if any - add initial question
    setQuestions([
      {
        question_text: "",
        question_type: "single_choice",
        points: 1,
        choices: [
          { choice_text: "", is_correct: false },
          { choice_text: "", is_correct: false },
        ],
      },
    ]);
  }, [examId]);

  const handleAddQuestion = () => {
    setQuestions([
      ...questions,
      {
        question_text: "",
        question_type: "single_choice",
        points: 1,
        choices: [
          { choice_text: "", is_correct: false },
          { choice_text: "", is_correct: false },
        ],
      },
    ]);
  };

  const handleRemoveQuestion = (index: number) => {
    setQuestions(questions.filter((_, i) => i !== index));
  };

  const handleMoveUp = (index: number) => {
    if (index > 0) {
      const newQuestions = [...questions];
      [newQuestions[index - 1], newQuestions[index]] = [
        newQuestions[index],
        newQuestions[index - 1],
      ];
      setQuestions(newQuestions);
    }
  };

  const handleMoveDown = (index: number) => {
    if (index < questions.length - 1) {
      const newQuestions = [...questions];
      [newQuestions[index], newQuestions[index + 1]] = [
        newQuestions[index + 1],
        newQuestions[index],
      ];
      setQuestions(newQuestions);
    }
  };

  const handleQuestionChange = (index: number, field: string, value: any) => {
    const newQuestions = [...questions];
    newQuestions[index] = { ...newQuestions[index], [field]: value };
    setQuestions(newQuestions);
  };

  const handleAddChoice = (questionIndex: number) => {
    const newQuestions = [...questions];
    if (!newQuestions[questionIndex].choices) {
      newQuestions[questionIndex].choices = [];
    }
    newQuestions[questionIndex].choices!.push({
      choice_text: "",
      is_correct: false,
    });
    setQuestions(newQuestions);
  };

  const handleRemoveChoice = (questionIndex: number, choiceIndex: number) => {
    const newQuestions = [...questions];
    newQuestions[questionIndex].choices = newQuestions[
      questionIndex
    ].choices!.filter((_, i) => i !== choiceIndex);
    setQuestions(newQuestions);
  };

  const handleChoiceChange = (
    questionIndex: number,
    choiceIndex: number,
    field: string,
    value: any
  ) => {
    const newQuestions = [...questions];
    newQuestions[questionIndex].choices![choiceIndex] = {
      ...newQuestions[questionIndex].choices![choiceIndex],
      [field]: value,
    };
    setQuestions(newQuestions);
  };

  const handleCopyAccessCode = async () => {
    if (exam.access_code) {
      try {
        await navigator.clipboard.writeText(exam.access_code);
        showSnackbar({
          message: "Access code copied to clipboard",
          severity: "success",
        });
      } catch (err) {
        showSnackbar({
          message: "Failed to copy access code",
          severity: "error",
        });
      }
    }
  };

  const scrollToQuestion = (index: number) => {
    questionRefs.current[index]?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  };

  const handleSubmit = () => {
    console.log("Updating exam:", examId, exam, "with questions:", questions);
    // In a real app, submit to backend
    showSnackbar({ message: "Exam updated successfully", severity: "success" });
    navigate("/admin/exams");
  };

  return (
    <Layout>
      <Box>
        <Typography
          variant="h4"
          component="h1"
          fontWeight="bold"
          gutterBottom
          sx={{ mb: 3, textAlign: "left" }}
        >
          Edit Exam
        </Typography>

        <Box sx={{ display: "flex", gap: 3, alignItems: "flex-start" }}>
          {/* Left Section - Exam Info */}
          <Box sx={{ flex: 1, maxWidth: 540, position: "sticky", top: 80 }}>
            <Card sx={{ p: 3 }}>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  mb: 3,
                }}
              >
                <Typography variant="h6">
                  <strong>Exam Information</strong>{" "}
                  <span style={{ color: "#9e9e9e" }}>({exam.type})</span>
                </Typography>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <Typography variant="body2" color="text.secondary">
                    Access Code:
                  </Typography>
                  <Typography variant="body1" fontWeight="medium">
                    {exam.access_code || "N/A"}
                  </Typography>
                  <IconButton
                    size="small"
                    onClick={handleCopyAccessCode}
                    sx={{ color: "primary.main" }}
                  >
                    <ContentCopy fontSize="small" />
                  </IconButton>
                </Box>
              </Box>
              <Box sx={{ display: "flex", flexDirection: "column", gap: 2.5 }}>
                <TextField
                  size="small"
                  fullWidth
                  label="Exam Title"
                  value={exam.title || ""}
                  onChange={(e) => setExam({ ...exam, title: e.target.value })}
                  required
                />
                <TextField
                  size="small"
                  fullWidth
                  label="Description"
                  multiline
                  rows={3}
                  value={exam.description || ""}
                  onChange={(e) =>
                    setExam({ ...exam, description: e.target.value })
                  }
                />
                <TextField
                  size="small"
                  fullWidth
                  label="Duration (minutes)"
                  type="number"
                  value={exam.duration_minutes || 60}
                  onChange={(e) =>
                    setExam({
                      ...exam,
                      duration_minutes: parseInt(e.target.value),
                    })
                  }
                />
                <TextField
                  size="small"
                  fullWidth
                  label="Start Time"
                  type="datetime-local"
                  value={exam.start_at || ""}
                  onChange={(e) =>
                    setExam({ ...exam, start_at: e.target.value })
                  }
                  sx={{ width: 440 }}
                  InputLabelProps={{ shrink: true }}
                />
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <TextField
                    size="small"
                    label="End Time"
                    type="datetime-local"
                    value={exam.end_at || ""}
                    onChange={(e) =>
                      setExam({ ...exam, end_at: e.target.value })
                    }
                    sx={{ width: 440 }}
                    InputLabelProps={{ shrink: true }}
                    disabled={!hasEndTime}
                  />
                  <Checkbox
                    checked={hasEndTime}
                    onChange={(e) => {
                      setHasEndTime(e.target.checked);
                      if (!e.target.checked) {
                        setExam({ ...exam, end_at: undefined });
                      }
                    }}
                    sx={{
                      color: "grey.500",
                      "&.Mui-checked": {
                        color: "grey.600",
                      },
                    }}
                  />
                </Box>
              </Box>

              {/* Question Grid Map */}
              {exam.type !== "coding" && questions.length > 0 && (
                <Box sx={{ mt: 2 }}>
                  <Typography
                    variant="body1"
                    fontWeight="bold"
                    gutterBottom
                    sx={{ textAlign: "left" }}
                  >
                    Question Map
                  </Typography>
                  <Box
                    sx={{
                      display: "grid",
                      gridTemplateColumns: "repeat(14, 1fr)",
                      gap: 0.5,
                    }}
                  >
                    {questions.map((_, index) => (
                      <Box
                        key={index}
                        onClick={() => scrollToQuestion(index)}
                        sx={{
                          width: "100%",
                          aspectRatio: "1",
                          cursor: "pointer",
                          bgcolor: "grey.100",
                          borderRadius: "4px",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          color: "text.secondary",
                          "&:hover": {
                            bgcolor: "grey.300",
                          },
                        }}
                      >
                        <Typography variant="body2">{index + 1}</Typography>
                      </Box>
                    ))}
                  </Box>
                </Box>
              )}
            </Card>
          </Box>

          {/* Right Section - Questions */}
          <Box sx={{ flex: 1.5, minWidth: 0 }}>
            <Card sx={{ p: 3 }}>
              {/* Questions Section */}
              {exam.type !== "coding" && (
                <>
                  {questions.map((question, qIndex) => (
                    <Box
                      key={qIndex}
                      ref={(el: HTMLDivElement | null) => {
                        questionRefs.current[qIndex] = el;
                      }}
                    >
                      <EditableQuestion
                        question={question}
                        questionIndex={qIndex}
                        onQuestionChange={handleQuestionChange}
                        onRemoveQuestion={handleRemoveQuestion}
                        onMoveUp={handleMoveUp}
                        onMoveDown={handleMoveDown}
                        onAddChoice={handleAddChoice}
                        onRemoveChoice={handleRemoveChoice}
                        onChoiceChange={handleChoiceChange}
                      />
                    </Box>
                  ))}
                  <Button
                    variant="outlined"
                    startIcon={<Add />}
                    onClick={handleAddQuestion}
                    sx={{ fontWeight: "bold", mt: 2 }}
                  >
                    Add Question
                  </Button>
                </>
              )}

              {exam.type === "coding" && (
                <Box sx={{ mt: 3 }}>
                  <Typography variant="h6" fontWeight="bold" gutterBottom>
                    Coding Problem
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Coding problem details and test cases can be configured
                    here.
                  </Typography>
                </Box>
              )}
            </Card>
          </Box>
        </Box>

        {/* Actions */}
        <Box
          sx={{ display: "flex", gap: 2, justifyContent: "flex-end", mt: 2 }}
        >
          <Button
            variant="outlined"
            onClick={() => navigate("/admin/exams")}
            sx={{
              px: 3,
              py: 1,
              fontWeight: "bold",
            }}
          >
            Cancel
          </Button>
          <Button
            variant="contained"
            onClick={handleSubmit}
            sx={{
              px: 3,
              py: 1,
              fontWeight: "bold",
              bgcolor: "grey.800",
              "&:hover": {
                bgcolor: "grey.900",
              },
            }}
          >
            Save Changes
          </Button>
        </Box>
      </Box>
    </Layout>
  );
};
