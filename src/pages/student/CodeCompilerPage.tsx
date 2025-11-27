import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Box, Typography, Tabs, Tab, IconButton, Button } from "@mui/material";
import { Timer, ArrowBack, Save } from "@mui/icons-material";
import { CodeEditor } from "../../components/student/CodeEditor";
import { mockCodingQuestions } from "../../shared/mockdata";
import { useExamTimer } from "../../shared/providers/ExamTimerProvider";

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;
  return (
    <div hidden={value !== index} {...other}>
      {value === index && <Box sx={{ pt: 2 }}>{children}</Box>}
    </div>
  );
}

export const StudentCodeCompilerPage = () => {
  const { examId, questionId } = useParams();
  const navigate = useNavigate();
  const { timeRemaining, formatTime } = useExamTimer();
  const [tabValue, setTabValue] = useState(0);

  // Find the current question
  const currentQuestion = mockCodingQuestions.find(
    (q) => q.question_id === questionId
  );

  // Initialize language from localStorage or default to first available
  const [language, setLanguage] = useState(() => {
    const savedLanguage = localStorage.getItem(`language_${questionId}`);
    return (
      savedLanguage || currentQuestion?.programming_languages?.[0] || "python"
    );
  });

  // Initialize code from localStorage or use template
  const [code, setCode] = useState(() => {
    const savedLanguage =
      localStorage.getItem(`language_${questionId}`) ||
      currentQuestion?.programming_languages?.[0] ||
      "python";
    const savedCode = localStorage.getItem(
      `code_${questionId}_${savedLanguage}`
    );
    if (savedCode) return savedCode;

    // Use the template from the question
    return (
      currentQuestion?.coding_template?.[savedLanguage] ||
      "# Write your Python code here\n\ndef solution():\n    pass\n"
    );
  });

  // Load code when language changes
  useEffect(() => {
    if (questionId && currentQuestion) {
      const savedCode = localStorage.getItem(`code_${questionId}_${language}`);
      if (savedCode) {
        setCode(savedCode);
      } else {
        // Load the template for the new language
        const template = currentQuestion.coding_template?.[language] || "";
        setCode(template);
      }
    }
  }, [language, questionId, currentQuestion]);

  useEffect(() => {
    // Navigate back if time runs out
    if (timeRemaining <= 0) {
      navigate(-2);
    }
  }, [timeRemaining, navigate, examId]);

  const handleSave = () => {
    if (questionId && language) {
      localStorage.setItem(`code_${questionId}_${language}`, code);
      localStorage.setItem(`language_${questionId}`, language);
      console.log("Code saved successfully!");
    }
  };

  const handleGoBack = () => {
    navigate(-1);
  };

  if (!currentQuestion) {
    return (
      <Box sx={{ p: 3 }}>
        <Typography>Question not found</Typography>
      </Box>
    );
  }

  const shakeAnimation = `
    @keyframes shake {
      0%, 100% { transform: rotate(0deg) translateY(0); }
      10%, 30%, 50%, 70%, 90% { transform: rotate(-10deg) translateY(-3px); }
      20%, 40%, 60%, 80% { transform: rotate(10deg) translateY(3px); }
    }
  `;

  return (
    <Box sx={{ display: "flex", height: "100vh", bgcolor: "white" }}>
      {/* Left Section - Exam Info */}
      <Box
        sx={{
          width: 600,
          p: 3,
          borderRight: "1px solid",
          borderColor: "divider",
          display: "flex",
          flexDirection: "column",
          gap: 0,
          overflowY: "auto",
        }}
      >
        {/* Exam Title and Timer */}
        <Box sx={{ mb: 2 }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2 }}>
            <IconButton size="small" onClick={handleGoBack}>
              <ArrowBack />
            </IconButton>
            <Typography variant="h6" fontWeight="bold">
              Python Programming Challenge
            </Typography>
          </Box>
          <Box
            sx={{
              p: 1.5,
              bgcolor: "grey.100",
              borderRadius: 2,
              display: "flex",
              alignItems: "center",
              gap: 1,
            }}
          >
            <style>{shakeAnimation}</style>
            <Timer
              fontSize="small"
              sx={{
                animation: timeRemaining <= 30 ? "shake 0.5s infinite" : "none",
              }}
            />
            <Typography variant="body1" fontWeight="bold" color="black">
              {formatTime(timeRemaining)}
            </Typography>
          </Box>
        </Box>

        {/* Problem Description */}
        <Box sx={{ flex: 1, overflowY: "auto" }}>
          <Tabs
            value={tabValue}
            onChange={(_, newValue) => setTabValue(newValue)}
            sx={{
              borderBottom: 1,
              borderColor: "divider",
              position: "sticky",
              top: 0,
              bgcolor: "white",
              zIndex: 1,
              mb: 2,
            }}
          >
            <Tab label="Problem" />
            <Tab label="Test Cases" />
          </Tabs>

          <TabPanel value={tabValue} index={0}>
            <Box sx={{ textAlign: "left" }}>
              <Box sx={{ display: "flex", gap: 3, mb: 2 }}>
                <Typography variant="body2" color="text.secondary">
                  Points: <strong>{currentQuestion.points}</strong>
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Languages:{" "}
                  <strong>
                    {currentQuestion.programming_languages?.join(", ") ||
                      "Python"}
                  </strong>
                </Typography>
              </Box>

              <Typography variant="h6" gutterBottom>
                Problem Statement
              </Typography>
              <Typography variant="body1" paragraph>
                {currentQuestion.question_text || "Solve this coding problem."}
              </Typography>

              {currentQuestion.coding_test_cases &&
                currentQuestion.coding_test_cases.length > 0 && (
                  <>
                    <Typography variant="subtitle1" gutterBottom sx={{ mt: 3 }}>
                      Example:
                    </Typography>
                    <Box
                      sx={{
                        p: 2,
                        bgcolor: "grey.100",
                        fontFamily: "monospace",
                        borderRadius: 1,
                      }}
                    >
                      <Typography variant="body2">
                        Input: {currentQuestion.coding_test_cases[0].input_data}
                      </Typography>
                      <Typography variant="body2">
                        Output:{" "}
                        {currentQuestion.coding_test_cases[0].expected_output}
                      </Typography>
                    </Box>
                  </>
                )}

              <Typography variant="subtitle1" gutterBottom sx={{ mt: 3 }}>
                Constraints:
              </Typography>
              <Typography variant="body2" component="ul">
                <li>Time limit: 2 seconds</li>
                <li>Memory limit: 256 MB</li>
                {currentQuestion.programming_languages && (
                  <li>
                    Supported languages:{" "}
                    {currentQuestion.programming_languages.join(", ")}
                  </li>
                )}
              </Typography>
            </Box>
          </TabPanel>

          <TabPanel value={tabValue} index={1}>
            <Box sx={{ textAlign: "left" }}>
              <Typography variant="h6" gutterBottom>
                Test Cases
              </Typography>

              {currentQuestion.coding_test_cases?.map((testCase) => (
                <Box
                  key={testCase.test_case_id}
                  sx={{
                    mb: 2,
                    bgcolor: "grey.100",
                    borderRadius: 2,
                    px: 3,
                    py: 1,
                  }}
                >
                  <Box sx={{ display: "flex", gap: 3 }}>
                    <Box sx={{ flex: 1 }}>
                      <Typography
                        variant="caption"
                        color="text.secondary"
                        fontWeight="bold"
                      >
                        Input:
                      </Typography>
                      <Typography
                        variant="body2"
                        sx={{
                          fontFamily: "monospace",
                          mt: 0.5,
                          whiteSpace: "pre-wrap",
                        }}
                      >
                        {testCase.input_data}
                      </Typography>
                    </Box>
                    <Box sx={{ flex: 1 }}>
                      <Typography
                        variant="caption"
                        color="text.secondary"
                        fontWeight="bold"
                      >
                        Expected Output:
                      </Typography>
                      <Typography
                        variant="body2"
                        sx={{
                          fontFamily: "monospace",
                          mt: 0.5,
                          whiteSpace: "pre-wrap",
                        }}
                      >
                        {testCase.expected_output}
                      </Typography>
                    </Box>
                  </Box>
                </Box>
              ))}

              <Typography variant="caption" color="text.secondary">
                Note: Some test cases may be hidden and will only be revealed
                after submission.
              </Typography>
            </Box>
          </TabPanel>
        </Box>

        {/* Save Button */}
        <Button
          variant="contained"
          startIcon={<Save />}
          onClick={handleSave}
          sx={{
            mt: "auto",
            width: 160,
            ml: "auto",
            py: 0.75,
            fontWeight: "bold",
            backgroundColor: "grey.400",
            color: "black",
          }}
        >
          Save Code
        </Button>
      </Box>
      <Box
        sx={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          p: 3,
          bgcolor: "grey.200",
          overflow: "hidden",
        }}
      >
        <CodeEditor
          value={code}
          onChange={(value) => setCode(value || "")}
          language={language}
          onLanguageChange={setLanguage}
        />
      </Box>
    </Box>
  );
};
