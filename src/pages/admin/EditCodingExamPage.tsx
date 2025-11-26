import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Box, Typography, Button, Divider } from "@mui/material";
import { Add } from "@mui/icons-material";
import { Layout } from "../../components/common";
import Card from "../../components/common/Card";
import { ExamInfoSection } from "../../components/admin/ExamInfoSection";
import { EditableCodingQuestion } from "../../components/admin/items";
import { useFeedback } from "../../shared/providers/FeedbackProvider";
import type { Exam, UpdateExamDTO, UpdateQuestionDTO } from "../../shared/dtos";
import type { ProgrammingLanguage } from "../../shared/enum";
import { mockExams } from "../../shared/mockdata";

// Helper function to generate temporary IDs for new items
const generateTempId = () => `temp_${crypto.randomUUID()}`;

const AVAILABLE_LANGUAGES: ProgrammingLanguage[] = [
  "python",
  "javascript",
  "java",
  "c++",
];

export const AdminEditCodingExamPage = () => {
  const { examId } = useParams();
  const navigate = useNavigate();
  const { showSnackbar } = useFeedback();
  const [exam, setExam] = useState<Partial<Exam>>({});
  const [questions, setQuestions] = useState<UpdateQuestionDTO[]>([]);
  const [hasEndTime, setHasEndTime] = useState<boolean>(true);

  useEffect(() => {
    // In a real app, fetch exam by ID
    const examData: any = mockExams.find((e) => e.exam_id === examId);
    if (examData) {
      setExam({
        ...examData,
        start_at: examData.start_at?.substring(0, 16),
        end_at: examData.end_at?.substring(0, 16),
      });
      setHasEndTime(!!examData.end_at);
    }

    // Initialize with one coding question
    setQuestions([
      {
        question_id: null, // null indicates this is a new question
        question_text: "",
        title: "",
        question_type: "coding",
        order: 0,
        points: 10,
        programming_languages: ["python"],
        coding_template: {
          python: "def solution():\n    # Your code here\n    pass",
        },
        codingTestCases: [
          {
            test_case_id: generateTempId(),
            input_data: "",
            expected_output: "",
            is_hidden: false,
          },
        ],
      },
    ]);
  }, [examId]);

  const handleAddQuestion = () => {
    setQuestions([
      ...questions,
      {
        question_id: null, // null indicates this is a new question
        question_text: "",
        title: "",
        question_type: "coding",
        order: questions.length,
        points: 10,
        programming_languages: ["python"],
        coding_template: {
          python: "def solution():\n    # Your code here\n    pass",
        },
        codingTestCases: [
          {
            test_case_id: generateTempId(),
            input_data: "",
            expected_output: "",
            is_hidden: false,
          },
        ],
      },
    ]);
  };

  const handleRemoveQuestion = (index: number) => {
    if (questions.length > 1) {
      setQuestions(questions.filter((_, i) => i !== index));
    } else {
      showSnackbar({
        message: "At least one question is required",
        severity: "warning",
      });
    }
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

  const handleLanguageToggle = (
    questionIndex: number,
    language: ProgrammingLanguage
  ) => {
    const newQuestions = [...questions];
    const currentLanguages =
      newQuestions[questionIndex].programming_languages || [];
    const currentTemplates = newQuestions[questionIndex].coding_template || {};

    if (currentLanguages.includes(language)) {
      // Remove language
      newQuestions[questionIndex].programming_languages =
        currentLanguages.filter(
          (lang: ProgrammingLanguage) => lang !== language
        );
      const { [language]: removed, ...remainingTemplates } = currentTemplates;
      newQuestions[questionIndex].coding_template = remainingTemplates;
    } else {
      // Add language with default template
      newQuestions[questionIndex].programming_languages = [
        ...currentLanguages,
        language,
      ];
      const defaultTemplates: Record<string, string> = {
        python: "def solution():\n    # Your code here\n    pass",
        javascript: "function solution() {\n    // Your code here\n}",
        java: "public class Solution {\n    public void solution() {\n        // Your code here\n    }\n}",
        "c++": "void solution() {\n    // Your code here\n}",
      };
      newQuestions[questionIndex].coding_template = {
        ...currentTemplates,
        [language]: defaultTemplates[language] || "",
      };
    }
    setQuestions(newQuestions);
  };

  const handleTemplateChange = (
    questionIndex: number,
    language: string,
    value: string
  ) => {
    const newQuestions = [...questions];
    newQuestions[questionIndex].coding_template = {
      ...newQuestions[questionIndex].coding_template,
      [language]: value,
    };
    setQuestions(newQuestions);
  };

  const handleAddTestCase = (questionIndex: number) => {
    const newQuestions = [...questions];
    if (!newQuestions[questionIndex].codingTestCases) {
      newQuestions[questionIndex].codingTestCases = [];
    }
    newQuestions[questionIndex].codingTestCases!.push({
      test_case_id: generateTempId(), // Generate temp UUID for new test case
      input_data: "",
      expected_output: "",
      is_hidden: false,
    });
    setQuestions(newQuestions);
  };

  const handleRemoveTestCase = (
    questionIndex: number,
    testCaseIndex: number
  ) => {
    const newQuestions = [...questions];
    newQuestions[questionIndex].codingTestCases = newQuestions[
      questionIndex
    ].codingTestCases!.filter((_: any, i: number) => i !== testCaseIndex);
    setQuestions(newQuestions);
  };

  const handleTestCaseChange = (
    questionIndex: number,
    testCaseIndex: number,
    field: string,
    value: any
  ) => {
    const newQuestions = [...questions];
    newQuestions[questionIndex].codingTestCases![testCaseIndex] = {
      ...newQuestions[questionIndex].codingTestCases![testCaseIndex],
      [field]: value,
    };
    setQuestions(newQuestions);
  };

  const handleExamChange = (updatedFields: Partial<UpdateExamDTO>) => {
    setExam({ ...exam, ...updatedFields });
  };

  const handleSubmit = () => {
    // Update order field for all questions based on their position
    const questionsWithOrder = questions.map((q, index) => ({
      ...q,
      order: index,
    }));

    const payload: any = {
      exam,
      questions: questionsWithOrder,
    };

    console.log("Updating coding exam:", examId, payload);
    // In a real app, submit to backend API
    // Questions with question_id: null will be created
    // Questions with question_id: <uuid> will be updated
    // Questions not in the array will be deleted
    // Same logic applies to choices and codingTestCases
    showSnackbar({
      message: "Coding exam updated successfully",
      severity: "success",
    });
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
          Edit Coding Exam
        </Typography>

        <Box sx={{ display: "flex", gap: 3, alignItems: "flex-start" }}>
          {/* Left Section - Exam Info */}
          <ExamInfoSection
            exam={exam}
            onExamChange={handleExamChange}
            hasEndTime={hasEndTime}
            onEndTimeToggle={setHasEndTime}
          />

          {/* Right Section - Coding Questions */}
          <Box sx={{ flex: 1.5, minWidth: 0 }}>
            <Card sx={{ p: 3 }}>
              {questions.map((question, qIndex) => (
                <>
                  <EditableCodingQuestion
                    key={qIndex}
                    question={question}
                    questionIndex={qIndex}
                    availableLanguages={AVAILABLE_LANGUAGES}
                    onQuestionChange={(field, value) =>
                      handleQuestionChange(qIndex, field, value)
                    }
                    onLanguageToggle={(lang) =>
                      handleLanguageToggle(qIndex, lang)
                    }
                    onTemplateChange={(lang, value) =>
                      handleTemplateChange(qIndex, lang, value)
                    }
                    onAddTestCase={() => handleAddTestCase(qIndex)}
                    onRemoveTestCase={(tcIndex) =>
                      handleRemoveTestCase(qIndex, tcIndex)
                    }
                    onTestCaseChange={(tcIndex, field, value) =>
                      handleTestCaseChange(qIndex, tcIndex, field, value)
                    }
                    onMoveUp={() => handleMoveUp(qIndex)}
                    onMoveDown={() => handleMoveDown(qIndex)}
                    onRemove={() => handleRemoveQuestion(qIndex)}
                  />
                  {qIndex < questions.length - 1 && <Divider sx={{ mt: 3 }} />}
                </>
              ))}

              <Box
                sx={{ display: "flex", justifyContent: "flex-start", mt: 2 }}
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
