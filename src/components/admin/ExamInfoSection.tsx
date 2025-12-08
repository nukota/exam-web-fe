import React from "react";
import {
  Box,
  Typography,
  TextField,
  Checkbox,
  IconButton,
} from "@mui/material";
import { ContentCopy } from "@mui/icons-material";
import Card from "../common/Card";
import type { CreateExamDTO, Exam } from "../../shared/dtos";
import { useFeedback } from "../../shared/providers/FeedbackProvider";

interface ExamInfoSectionProps {
  exam: Partial<Exam>; // Full exam data including access_code for display
  onExamChange: (exam: Partial<CreateExamDTO>) => void; // Only editable fields
  hasEndTime: boolean;
  onEndTimeToggle: (enabled: boolean) => void;
  questions?: any[];
  onScrollToQuestion?: (index: number) => void;
}

export const ExamInfoSection = ({
  exam,
  onExamChange,
  hasEndTime,
  onEndTimeToggle,
  questions = [],
  onScrollToQuestion,
}: ExamInfoSectionProps) => {
  const { showSnackbar } = useFeedback();
  const showQuestionMap = exam.type !== "coding" && questions.length > 0;
  const [durationInput, setDurationInput] = React.useState<string>(String(exam.duration_minutes || 60));

  React.useEffect(() => {
    setDurationInput(String(exam.duration_minutes || 60));
  }, [exam.duration_minutes]);

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

  return (
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
              disabled={!exam.access_code}
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
            onChange={(e) => onExamChange({ ...exam, title: e.target.value })}
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
              onExamChange({ ...exam, description: e.target.value })
            }
          />
          <TextField
            size="small"
            fullWidth
            label="Duration (minutes)"
            type="number"
            value={durationInput}
            onChange={(e) => {
              const value = e.target.value;
              setDurationInput(value);
              const parsed = parseInt(value);
              if (!isNaN(parsed) && parsed > 0) {
                onExamChange({
                  ...exam,
                  duration_minutes: parsed,
                });
              }
            }}
            error={!durationInput || parseInt(durationInput) <= 0}
          />
          <TextField
            size="small"
            fullWidth
            label="Start Time"
            type="datetime-local"
            value={exam.start_at || ""}
            onChange={(e) =>
              onExamChange({ ...exam, start_at: e.target.value })
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
                onExamChange({ ...exam, end_at: e.target.value })
              }
              sx={{ width: 440 }}
              InputLabelProps={{ shrink: true }}
              disabled={!hasEndTime}
            />
            <Checkbox
              checked={hasEndTime}
              onChange={(e) => {
                onEndTimeToggle(e.target.checked);
                if (!e.target.checked) {
                  onExamChange({ ...exam, end_at: undefined });
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
        {showQuestionMap && (
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
                  onClick={() => onScrollToQuestion?.(index)}
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
  );
};
