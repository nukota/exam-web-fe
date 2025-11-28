import { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Box, Typography, Button } from "@mui/material";
import { Add } from "@mui/icons-material";
import { Layout } from "../../components/common";
import Card from "../../components/common/Card";
import { EditableQuestion } from "../../components/admin/items/EditableQuestion";
import { ExamInfoSection } from "../../components/admin/ExamInfoSection";
import { useFeedback } from "../../shared/providers/FeedbackProvider";
import type { CreateExamDTO, Exam, UpdateQuestionDTO } from "../../shared/dtos";
import { useExam, useUpdateExam } from "../../services/examsService";

// Helper function to generate temporary IDs for new items
const generateTempId = () => `temp_${crypto.randomUUID()}`;

export const AdminEditStandardExamPage = () => {
  const { examId } = useParams();
  const navigate = useNavigate();
  const { showSnackbar } = useFeedback();
  const [exam, setExam] = useState<Partial<Exam>>({});
  const [questions, setQuestions] = useState<UpdateQuestionDTO[]>([]);
  const [hasEndTime, setHasEndTime] = useState<boolean>(true);
  const questionRefs = useRef<Record<number, HTMLDivElement | null>>({});

  const { data: examData, isLoading, error } = useExam(examId || "", !!examId);
  const updateExamMutation = useUpdateExam();

  useEffect(() => {
    if (examData) {
      setExam({
        ...examData,
        start_at: examData.start_at?.substring(0, 16),
        end_at: examData.end_at?.substring(0, 16),
      });
      setHasEndTime(!!examData.end_at);

      // Load existing questions or add initial question
      if (examData.questions && examData.questions.length > 0) {
        setQuestions(
          examData.questions.map((q) => ({
            question_id: q.question_id,
            question_text: q.question_text,
            question_type: q.question_type,
            order: q.order,
            points: q.points,
            correct_answer: q.correct_answer || [],
            choices:
              q.choices?.map((c) => ({
                choice_id: c.choice_id,
                choice_text: c.choice_text,
              })) || [],
          }))
        );
      } else {
        setQuestions([
          {
            question_id: null,
            question_text: "",
            question_type: "single_choice",
            order: 0,
            points: 1,
            correct_answer: [],
            choices: [
              { choice_id: generateTempId(), choice_text: "" },
              { choice_id: generateTempId(), choice_text: "" },
            ],
          },
        ]);
      }
    }
  }, [examData]);

  const handleAddQuestion = () => {
    setQuestions([
      ...questions,
      {
        question_id: null, // null indicates this is a new question
        question_text: "",
        question_type: "single_choice",
        order: questions.length,
        points: 1,
        correct_answer: [],
        choices: [
          { choice_id: generateTempId(), choice_text: "" },
          { choice_id: generateTempId(), choice_text: "" },
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

    // If question type changes to short_answer or essay, remove choices
    if (
      field === "question_type" &&
      (value === "short_answer" || value === "essay")
    ) {
      newQuestions[index].choices = [];
      newQuestions[index].correct_answer = [];
    }

    // If question type changes to single_choice or multiple_choice and no choices exist, add default choices
    if (
      field === "question_type" &&
      (value === "single_choice" || value === "multiple_choice")
    ) {
      if (
        !newQuestions[index].choices ||
        newQuestions[index].choices!.length === 0
      ) {
        newQuestions[index].choices = [
          { choice_id: generateTempId(), choice_text: "" },
          { choice_id: generateTempId(), choice_text: "" },
        ];
      }
      newQuestions[index].correct_answer_text = [];
    }

    setQuestions(newQuestions);
  };

  const handleAddChoice = (questionIndex: number) => {
    const newQuestions = [...questions];
    if (!newQuestions[questionIndex].choices) {
      newQuestions[questionIndex].choices = [];
    }
    newQuestions[questionIndex].choices!.push({
      choice_id: generateTempId(), // Generate temp UUID for new choice
      choice_text: "",
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

  const scrollToQuestion = (index: number) => {
    questionRefs.current[index]?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  };

  const handleExamChange = (updatedFields: Partial<CreateExamDTO>) => {
    setExam({ ...exam, ...updatedFields });
  };

  const handleSubmit = () => {
    if (!examId) return;

    // Update order field for all questions based on their position
    const questionsWithOrder = questions.map((q, index) => ({
      ...q,
      order: index,
    }));

    const payload: any = {
      title: exam.title,
      description: exam.description,
      type: exam.type,
      start_at: exam.start_at,
      end_at: exam.end_at,
      duration_minutes: exam.duration_minutes,
      questions: questionsWithOrder,
    };

    updateExamMutation.mutate(
      { examId, data: payload },
      {
        onSuccess: () => {
          showSnackbar({
            message: "Exam updated successfully",
            severity: "success",
          });
          navigate("/admin/exams");
        },
        onError: (error: any) => {
          showSnackbar({
            message: error.message || "Failed to update exam",
            severity: "error",
          });
        },
      }
    );
  };

  if (isLoading) {
    return (
      <Layout>
        <Typography>Loading exam data...</Typography>
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout>
        <Typography color="error">Failed to load exam data</Typography>
      </Layout>
    );
  }

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
            onExamChange={handleExamChange}
            hasEndTime={hasEndTime}
            onEndTimeToggle={setHasEndTime}
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
