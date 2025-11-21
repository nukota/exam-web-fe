import { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Box,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";

interface CreateExamDialogProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (examData: {
    title: string;
    description: string;
    type: string;
    duration_minutes: number;
    start_at: string;
    end_at: string;
  }) => void;
}

export const CreateExamDialog: React.FC<CreateExamDialogProps> = ({
  open,
  onClose,
  onSubmit,
}) => {
  const [exam, setExam] = useState({
    title: "",
    description: "",
    type: "standard",
    duration_minutes: 60,
    start_at: "",
    end_at: "",
  });

  const handleSubmit = () => {
    if (!exam.title) {
      return;
    }
    onSubmit(exam);
    setExam({
      title: "",
      description: "",
      type: "standard",
      duration_minutes: 60,
      start_at: "",
      end_at: "",
    });
  };

  const handleClose = () => {
    setExam({
      title: "",
      description: "",
      type: "standard",
      duration_minutes: 60,
      start_at: "",
      end_at: "",
    });
    onClose();
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle sx={{ fontWeight: "bold" }}>Create New Exam</DialogTitle>
      <DialogContent>
        <Box sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 1 }}>
          <TextField
            size="small"
            fullWidth
            label="Exam Title"
            value={exam.title}
            onChange={(e) => setExam({ ...exam, title: e.target.value })}
            required
          />
          <TextField
            size="small"
            fullWidth
            label="Description"
            multiline
            rows={3}
            value={exam.description}
            onChange={(e) => setExam({ ...exam, description: e.target.value })}
          />
          <Box sx={{ display: "flex", gap: 2 }}>
            <FormControl fullWidth>
              <InputLabel>Exam Type</InputLabel>
              <Select
                value={exam.type}
                label="Exam Type"
                onChange={(e) => setExam({ ...exam, type: e.target.value })}
              >
                <MenuItem value="standard">Standard</MenuItem>
                <MenuItem value="coding">Coding</MenuItem>
              </Select>
            </FormControl>
          </Box>
          <Box sx={{ display: "flex", gap: 2 }}>
            <TextField
              size="small"
              fullWidth
              label="Duration (minutes)"
              type="number"
              value={exam.duration_minutes}
              onChange={(e) =>
                setExam({
                  ...exam,
                  duration_minutes: parseInt(e.target.value) || 60,
                })
              }
            />
          </Box>
          <Box sx={{ display: "flex", gap: 2 }}>
            <TextField
              size="small"
              fullWidth
              label="Start Time"
              type="datetime-local"
              value={exam.start_at}
              onChange={(e) => setExam({ ...exam, start_at: e.target.value })}
              InputLabelProps={{ shrink: true }}
            />
            <TextField
              size="small"
              fullWidth
              label="End Time"
              type="datetime-local"
              value={exam.end_at}
              onChange={(e) => setExam({ ...exam, end_at: e.target.value })}
              InputLabelProps={{ shrink: true }}
            />
          </Box>
        </Box>
      </DialogContent>
      <DialogActions sx={{ p: 2 }}>
        <Button onClick={handleClose} color="inherit">
          Cancel
        </Button>
        <Button
          onClick={handleSubmit}
          variant="contained"
          disabled={!exam.title}
          sx={{ fontWeight: "bold" }}
        >
          Create Exam
        </Button>
      </DialogActions>
    </Dialog>
  );
};
