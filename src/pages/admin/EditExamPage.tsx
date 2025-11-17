import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Box,
  Typography,
  Paper,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import { Layout } from "../../components/common";
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
        <Typography variant="h4" component="h1" fontWeight="bold" gutterBottom>
          Edit Exam
        </Typography>

        <Paper elevation={2} sx={{ p: 3 }}>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
            <TextField
              fullWidth
              label="Exam Title"
              value={exam.title || ""}
              onChange={(e) => setExam({ ...exam, title: e.target.value })}
              required
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
              />
              <TextField
                fullWidth
                label="Start Time"
                type="datetime-local"
                value={exam.start_at || ""}
                onChange={(e) => setExam({ ...exam, start_at: e.target.value })}
                InputLabelProps={{ shrink: true }}
              />
              <TextField
                fullWidth
                label="End Time"
                type="datetime-local"
                value={exam.end_at || ""}
                onChange={(e) => setExam({ ...exam, end_at: e.target.value })}
                InputLabelProps={{ shrink: true }}
              />
            </Box>
          </Box>

          <Box
            sx={{ display: "flex", gap: 2, justifyContent: "flex-end", mt: 3 }}
          >
            <Button variant="outlined" onClick={() => navigate("/admin/exams")}>
              Cancel
            </Button>
            <Button variant="contained" onClick={handleSubmit}>
              Save Changes
            </Button>
          </Box>
        </Paper>
      </Box>
    </Layout>
  );
};
