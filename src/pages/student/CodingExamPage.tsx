import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Box,
  Typography,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Tabs,
  Tab,
} from "@mui/material";
import { Timer, Send, PlayArrow } from "@mui/icons-material";
import { CodeEditor } from "../../components/student/CodeEditor";

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

export const StudentCodingExamPage = () => {
  const { examId } = useParams();
  const navigate = useNavigate();
  const [code, setCode] = useState(
    "# Write your Python code here\n\ndef solution():\n    pass\n"
  );
  const [language, setLanguage] = useState("python");
  const [timeRemaining, setTimeRemaining] = useState(5400); // 90 minutes
  const [submitDialogOpen, setSubmitDialogOpen] = useState(false);
  const [tabValue, setTabValue] = useState(0);
  const [consoleOutput, setConsoleOutput] = useState<string>("");
  const [isRunning, setIsRunning] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev <= 1) {
          handleSubmit();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const handleSubmit = () => {
    console.log("Submitting code:", code);
    console.log("Language:", language);
    navigate(`/student/exam/${examId}/result`);
  };

  const handleRunCode = () => {
    setIsRunning(true);
    setConsoleOutput("Running code...\n");

    // Simulate code execution
    setTimeout(() => {
      const output = `Execution started...\n\nTest Case 1:\nInput: "babad"\nOutput: "bab"\nStatus: ✓ Passed\n\nTest Case 2:\nInput: "cbbd"\nOutput: "bb"\nStatus: ✓ Passed\n\nExecution completed successfully.\nTotal time: 0.12s`;
      setConsoleOutput(output);
      setIsRunning(false);
    }, 1500);
  };

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hours.toString().padStart(2, "0")}:${minutes
      .toString()
      .padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

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
          <Typography variant="h6" fontWeight="bold" sx={{ mb: 2 }}>
            Python Programming Challenge
          </Typography>
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
            sx={{ borderBottom: 1, borderColor: "divider", mb: 2 }}
          >
            <Tab label="Problem" />
            <Tab label="Test Cases" />
          </Tabs>

          <TabPanel value={tabValue} index={0}>
            <Box sx={{ textAlign: "left" }}>
              <Box sx={{ display: "flex", gap: 3, mb: 2 }}>
                <Typography variant="body2" color="text.secondary">
                  Points: <strong>10</strong>
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Difficulty: <strong>Medium</strong>
                </Typography>
              </Box>

              <Typography variant="h6" gutterBottom>
                Problem Statement
              </Typography>
              <Typography variant="body1" paragraph>
                Write a function that finds the longest palindromic substring in
                a given string.
              </Typography>

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
                <Typography variant="body2">Input: "babad"</Typography>
                <Typography variant="body2">Output: "bab" or "aba"</Typography>
              </Box>

              <Typography variant="subtitle1" gutterBottom sx={{ mt: 3 }}>
                Constraints:
              </Typography>
              <Typography variant="body2" component="ul">
                <li>1 ≤ string length ≤ 1000</li>
                <li>String consists of lowercase letters only</li>
              </Typography>
            </Box>
          </TabPanel>

          <TabPanel value={tabValue} index={1}>
            <Box sx={{ textAlign: "left" }}>
              <Typography variant="h6" gutterBottom>
                Test Cases
              </Typography>

              <Box sx={{ mb: 2, bgcolor: "grey.100", borderRadius: 1, p: 2 }}>
                <Typography variant="subtitle2" gutterBottom>
                  Test Case 1:
                </Typography>
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
                      sx={{ fontFamily: "monospace", mt: 0.5 }}
                    >
                      "babad"
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
                      sx={{ fontFamily: "monospace", mt: 0.5 }}
                    >
                      "bab" or "aba"
                    </Typography>
                  </Box>
                </Box>
              </Box>

              <Box sx={{ mb: 2, bgcolor: "grey.100", borderRadius: 1, p: 2 }}>
                <Typography variant="subtitle2" gutterBottom>
                  Test Case 2:
                </Typography>
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
                      sx={{ fontFamily: "monospace", mt: 0.5 }}
                    >
                      "cbbd"
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
                      sx={{ fontFamily: "monospace", mt: 0.5 }}
                    >
                      "bb"
                    </Typography>
                  </Box>
                </Box>
              </Box>

              <Typography variant="caption" color="text.secondary">
                Note: Some test cases may be hidden and will only be revealed
                after submission.
              </Typography>
            </Box>
          </TabPanel>
        </Box>

        {/* Submit Button */}
        <Button
          variant="contained"
          startIcon={<Send />}
          onClick={() => setSubmitDialogOpen(true)}
          sx={{
            mt: "auto",
            width: 180,
            ml: "auto",
            py: 1,
            fontWeight: "bold",
            backgroundColor: "grey.400",
            color: "black",
          }}
        >
          Submit Code
        </Button>
      </Box>

      {/* Right Section - Code Editor */}
      <Box
        sx={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          p: 3,
          bgcolor: "grey.50",
          overflow: "hidden",
        }}
      >
        <Box sx={{ display: "flex", gap: 2, mb: 2 }}>
          <Button
            variant="outlined"
            startIcon={<PlayArrow />}
            onClick={handleRunCode}
            disabled={isRunning}
          >
            {isRunning ? "Running..." : "Run Code"}
          </Button>
        </Box>

        {/* Code Editor - 60% height */}
        <Box sx={{ height: "60%", mb: 2, overflow: "hidden" }}>
          <CodeEditor
            value={code}
            onChange={(value) => setCode(value || "")}
            language={language}
            onLanguageChange={setLanguage}
            height="100%"
          />
        </Box>

        {/* Console Output - 40% height */}
        <Box
          sx={{
            height: "40%",
            border: "1px solid #e0e0e0",
            borderRadius: 2,
            bgcolor: "white",
            p: 2,
            display: "flex",
            flexDirection: "column",
          }}
        >
          <Typography variant="subtitle2" fontWeight="bold" sx={{ mb: 1 }}>
            Console Output
          </Typography>
          <Box
            sx={{
              flex: 1,
              overflowY: "auto",
              fontFamily: "monospace",
              fontSize: "13px",
              whiteSpace: "pre-wrap",
              bgcolor: "grey.50",
              p: 2,
              borderRadius: 1,
              color: consoleOutput ? "text.primary" : "text.disabled",
            }}
          >
            {consoleOutput ||
              "No output yet. Click 'Run Code' to execute your code."}
          </Box>
        </Box>
      </Box>

      {/* Submit Confirmation Dialog */}
      <Dialog
        open={submitDialogOpen}
        onClose={() => setSubmitDialogOpen(false)}
      >
        <DialogTitle>Submit Code?</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to submit your code? Once submitted, you
            cannot make changes.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setSubmitDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleSubmit} variant="contained" color="success">
            Submit
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};
