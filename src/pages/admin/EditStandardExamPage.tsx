import { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Box, Typography, Button } from "@mui/material";
import { Add } from "@mui/icons-material";
import { Layout } from "../../components/common";
import Card from "../../components/common/Card";
import { EditableQuestion } from "../../components/admin/items/EditableQuestion";
import { ExamInfoSection } from "../../components/admin/ExamInfoSection";
import { useFeedback } from "../../shared/providers/FeedbackProvider";
import type { UpdateExamDto, CreateQuestionDto } from "../../shared/dtos";
import { mockExams } from "../../shared/mockdata";

export const AdminEditStandardExamPage = () => {
  const { examId } = useParams();
  const navigate = useNavigate();
  const { showSnackbar } = useFeedback();
  const [exam, setExam] = useState<Partial<UpdateExamDto>>({});
  const [questions, setQuestions] = useState<Partial<CreateQuestionDto>[]>([]);
  const [hasEndTime, setHasEndTime] = useState<boolean>(true);
  const questionRefs = useRef<Record<number, HTMLDivElement | null>>({});

  useEffect(() => {
    // In a real app, fetch exam by ID
    const examData: any = mockExams[0];
    setExam({
      title: examData.title,
      description: examData.description,
      type: examData.type,
      access_code: examData.access_code,
      duration_minutes: examData.duration_minutes,
      start_at: examData.start_at?.substring(0, 16),
      end_at: examData.end_at?.substring(0, 16),
    });
    // Set hasEndTime based on whether end_at exists
    setHasEndTime(!!examData.end_at);
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
          <ExamInfoSection
            exam={exam}
            onExamChange={setExam}
            hasEndTime={hasEndTime}
            onEndTimeToggle={setHasEndTime}
            onCopyAccessCode={handleCopyAccessCode}
            questions={questions}
            onScrollToQuestion={scrollToQuestion}
          />

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
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "flex-start",
                      mt: -2,
                    }}
                  >
                    <Button
                      startIcon={<Add />}
                      onClick={handleAddQuestion}
                      sx={{
                        fontWeight: "bold",
                        backgroundColor: "grey.300",
                        color: "grey.800",
                        px: 2,
                      }}
                    >
                      Add Question
                    </Button>
                  </Box>
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
            variant="text"
            color="inherit"
            onClick={() => navigate("/admin/exams")}
            sx={{
              fontWeight: "bold",
            }}
          >
            Cancel
          </Button>
          <Button
            variant="contained"
            onClick={handleSubmit}
            sx={{
              px: 2,
              fontWeight: "bold",
              backgroundColor: "grey.400",
              color: "grey.900",
            }}
          >
            Save Changes
          </Button>
        </Box>
      </Box>
    </Layout>
  );
};
