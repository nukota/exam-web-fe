import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Box,
  Typography,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import { Layout } from "../../components/common";
import Card from "../../components/common/Card";
import type { UpdateExamDto } from "../../shared/dtos";
import { mockExam } from "../../shared/mockdata";

export const AdminEditExamPage = () => {
  const { examId } = useParams();
  const navigate = useNavigate();
  const [exam, setExam] = useState<Partial<UpdateExamDto>>({});

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
  }, [examId]);

  const handleSubmit = () => {
    console.log("Updating exam:", examId, exam);
    // In a real app, submit to backend
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
          sx={{ mb: 3 }}
        >
          Edit Exam
        </Typography>

        <Card sx={{ p: 3 }}>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2.5 }}>
            <TextField
              fullWidth
              label="Exam Title"
              value={exam.title || ""}
              onChange={(e) => setExam({ ...exam, title: e.target.value })}
              required
              sx={{
                "& .MuiOutlinedInput-root": {
                  bgcolor: "grey.50",
                },
              }}
            />
            <TextField
              fullWidth
              label="Description"
              multiline
              rows={3}
              value={exam.description || ""}
              onChange={(e) =>
                setExam({ ...exam, description: e.target.value })
              }
              sx={{
                "& .MuiOutlinedInput-root": {
                  bgcolor: "grey.50",
                },
              }}
            />
            <Box sx={{ display: "flex", gap: 2 }}>
              <FormControl fullWidth>
                <InputLabel>Exam Type</InputLabel>
                <Select
                  value={exam.type || "multiple_choice"}
                  label="Exam Type"
                  onChange={(e) =>
                    setExam({ ...exam, type: e.target.value as any })
                  }
                  sx={{
                    bgcolor: "grey.50",
                  }}
                >
                  <MenuItem value="multiple_choice">
                    Standard (Multiple Choice)
                  </MenuItem>
                  <MenuItem value="essay">Essay</MenuItem>
                  <MenuItem value="coding">Coding</MenuItem>
                </Select>
              </FormControl>
              <TextField
                fullWidth
                label="Access Code"
                value={exam.access_code || ""}
                onChange={(e) =>
                  setExam({ ...exam, access_code: e.target.value })
                }
                required
                sx={{
                  "& .MuiOutlinedInput-root": {
                    bgcolor: "grey.50",
                  },
                }}
              />
            </Box>
            <Box sx={{ display: "flex", gap: 2 }}>
              <TextField
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
                sx={{
                  "& .MuiOutlinedInput-root": {
                    bgcolor: "grey.50",
                  },
                }}
              />
              <TextField
                fullWidth
                label="Start Time"
                type="datetime-local"
                value={exam.start_at || ""}
                onChange={(e) => setExam({ ...exam, start_at: e.target.value })}
                InputLabelProps={{ shrink: true }}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    bgcolor: "grey.50",
                  },
                }}
              />
              <TextField
                fullWidth
                label="End Time"
                type="datetime-local"
                value={exam.end_at || ""}
                onChange={(e) => setExam({ ...exam, end_at: e.target.value })}
                InputLabelProps={{ shrink: true }}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    bgcolor: "grey.50",
                  },
                }}
              />
            </Box>
          </Box>

          <Box
            sx={{ display: "flex", gap: 2, justifyContent: "flex-end", mt: 4 }}
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
        </Card>
      </Box>
    </Layout>
  );
};
