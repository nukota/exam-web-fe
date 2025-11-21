import { useState } from "react";
import Editor from "@monaco-editor/react";
import {
  Box,
  Typography,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  IconButton,
} from "@mui/material";
import { PlayArrow } from "@mui/icons-material";
import Card from "../common/Card";
import { executeCodeWithJudge0 } from "../../services/codeExecutionService";

interface CodeEditorProps {
  value: string;
  onChange: (value: string | undefined) => void;
  language?: string;
  onLanguageChange?: (language: string) => void;
  readOnly?: boolean;
}

const SUPPORTED_LANGUAGES = [
  { value: "cpp", label: "C++" },
  { value: "python", label: "Python" },
  { value: "javascript", label: "JavaScript" },
  { value: "java", label: "Java" },
];

export const CodeEditor: React.FC<CodeEditorProps> = ({
  value,
  onChange,
  language = "python",
  onLanguageChange,
  readOnly = false,
}) => {
  const [consoleOutput, setConsoleOutput] = useState<string>("");
  const [consoleInput, setConsoleInput] = useState<string>("");
  const [isRunning, setIsRunning] = useState(false);

  const handleRunCode = async () => {
    setIsRunning(true);
    setConsoleOutput("Running code...\n");

    try {
      const output = await executeCodeWithJudge0(value, language, consoleInput);
      setConsoleOutput(output);
    } catch (error: any) {
      setConsoleOutput(`Error: ${error.message}`);
    } finally {
      setIsRunning(false);
    }
  };
  return (
    <Box
      sx={{ display: "flex", flexDirection: "column", height: "100%", gap: 2 }}
    >
      {/* Code Editor - 70% height */}
      <Card
        sx={{ height: "70%", p: 2, display: "flex", flexDirection: "column" }}
      >
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 1,
          }}
        >
          <Typography variant="h6" fontWeight="bold">
            Code Editor
          </Typography>
          {onLanguageChange && (
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <FormControl size="small" sx={{ minWidth: 150 }}>
                <InputLabel>Language</InputLabel>
                <Select
                  value={language}
                  label="Language"
                  onChange={(e) => onLanguageChange(e.target.value)}
                  disabled={readOnly}
                >
                  {SUPPORTED_LANGUAGES.map((lang) => (
                    <MenuItem key={lang.value} value={lang.value}>
                      {lang.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              <IconButton
                onClick={handleRunCode}
                size="small"
                sx={{ color: "black" }}
                aria-label={isRunning ? "Running" : "Run code"}
                disabled={isRunning || readOnly}
              >
                <PlayArrow />
              </IconButton>
            </Box>
          )}
        </Box>
        <Box
          sx={{
            border: "1px solid #ddd",
            borderRadius: 1,
            flex: 1,
            overflow: "hidden",
          }}
        >
          <Editor
            height="100%"
            language={language}
            value={value}
            onChange={onChange}
            theme="vs-light"
            options={{
              readOnly,
              minimap: { enabled: false },
              fontSize: 14,
              lineNumbers: "on",
              scrollBeyondLastLine: false,
              automaticLayout: true,
            }}
          />
        </Box>
      </Card>

      {/* Console - 30% height */}
      <Box
        sx={{
          height: "30%",
          border: "1px solid #e0e0e0",
          borderRadius: 2,
          bgcolor: "white",
          p: 2,
          display: "flex",
          gap: 2,
          flex: 1,
        }}
      >
        {/* Input Section - Left */}
        <Box
          sx={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
          }}
        >
          <Typography
            variant="subtitle1"
            fontWeight="bold"
            sx={{ mb: 1, color: "text.secondary" }}
          >
            Input
          </Typography>
          <Box
            component="textarea"
            value={
              language === "javascript"
                ? "Input is not supported for JavaScript"
                : consoleInput
            }
            onChange={
              language === "javascript"
                ? undefined
                : (e) => setConsoleInput(e.target.value)
            }
            placeholder={
              language === "javascript"
                ? ""
                : "Please input all the variables before running the program"
            }
            disabled={readOnly || language === "javascript"}
            sx={{
              flex: 1,
              fontFamily: "monospace",
              fontSize: "13px",
              whiteSpace: "pre-wrap",
              bgcolor: "grey.50",
              p: 2,
              borderRadius: 1,
              border: "1px solid #e0e0e0",
              resize: "none",
              outline: "none",
              "&:focus": {
                borderColor: "primary.main",
              },
              "&:disabled": {
                bgcolor: "grey.100",
                cursor: "not-allowed",
              },
            }}
          />
        </Box>

        {/* Output Section - Right */}
        <Box
          sx={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
          }}
        >
          <Typography
            variant="subtitle1"
            fontWeight="bold"
            sx={{ mb: 1, color: "text.secondary" }}
          >
            Output
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
              border: "1px solid #e0e0e0",
              color: consoleOutput ? "text.primary" : "text.disabled",
              textAlign: "left",
            }}
          >
            {consoleOutput ||
              "No output yet. Click the run icon to execute your code."}
          </Box>
        </Box>
      </Box>
    </Box>
  );
};
