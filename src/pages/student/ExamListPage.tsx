import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Typography,
  Button,
  TextField,
  Select,
  MenuItem,
  CircularProgress,
} from "@mui/material";
import { Card, Layout } from "../../components/common";
import ExamItem from "../../components/student/items/ExamItem";
import { isExamActive } from "../../shared/utils";
import { useExams } from "../../services/examsService";
import { useJoinExam, useLeaveExam } from "../../services/attemptsService";
import { useFeedback } from "../../shared/providers/FeedbackProvider";

export const StudentExamListPage = () => {
  const [accessCode, setAccessCode] = useState("");
  const [selectedType, setSelectedType] = useState("all");
  const navigate = useNavigate();
  const { showSnackbar } = useFeedback();

  const { data: exams, isLoading, error } = useExams();
  const joinExamMutation = useJoinExam();
  const leaveExamMutation = useLeaveExam();

  const handleStartExam = (examId: string, _examType: string) => {
    // Always navigate to setup page first
    navigate(`/student/exam/${examId}/setup`);
  };

  const filteredExams = (exams || []).filter(
    (exam) => selectedType === "all" || exam.type === selectedType
  );

  const handleJoinWithCode = () => {
    if (!accessCode.trim()) {
      showSnackbar({
        message: "Please enter an exam code",
        severity: "warning",
      });
      return;
    }

    joinExamMutation.mutate(accessCode, {
      onSuccess: () => {
        showSnackbar({
          message: "Successfully joined the exam",
          severity: "success",
        });
        setAccessCode("");
      },
      onError: (error: any) => {
        showSnackbar({
          message: error.message || "Failed to join exam",
          severity: "error",
        });
      },
    });
  };

  const handleLeaveExam = (examId: string) => {
    leaveExamMutation.mutate(examId, {
      onSuccess: () => {
        showSnackbar({
          message: "Successfully left the exam",
          severity: "success",
        });
      },
      onError: (error: any) => {
        showSnackbar({
          message: error.message || "Failed to leave exam",
          severity: "error",
        });
      },
    });
  };

  if (isLoading) {
    return (
      <Layout>
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            minHeight: "50vh",
          }}
        >
          <CircularProgress />
        </Box>
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout>
        <Box>
          <Typography color="error">Failed to load exams</Typography>
        </Box>
      </Layout>
    );
  }

  return (
    <Layout>
      <Box>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            mb: 3,
            gap: 2,
            flexWrap: "wrap",
          }}
        >
          <Typography
            variant="h4"
            component="h1"
            fontWeight="bold"
            sx={{ flexGrow: 1, alignItems: "flex-start", display: "flex" }}
          >
            Available Exams
          </Typography>
          <TextField
            label="Exam Code"
            variant="outlined"
            size="small"
            value={accessCode}
            onChange={(e) => setAccessCode(e.target.value)}
            onKeyPress={(e) => {
              if (e.key === "Enter") {
                handleJoinWithCode();
              }
            }}
          />
          <Select
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
            size="small"
            sx={{ minWidth: 120 }}
            displayEmpty
          >
            <MenuItem value="all">All Exams</MenuItem>
            <MenuItem value="standard">Standard</MenuItem>
            <MenuItem value="coding">Coding</MenuItem>
          </Select>
          <Button
            variant="contained"
            onClick={handleJoinWithCode}
            disabled={joinExamMutation.isPending || !accessCode.trim()}
          >
            {joinExamMutation.isPending ? "Joining..." : "Join Exam"}
          </Button>
        </Box>

        {filteredExams.length === 0 ? (
          <Card
            sx={{
              height: 400,
              width: "100%",
              alignContent: "center",
              justifyContent: "center",
            }}
          >
            <Typography variant="body1" color="text.secondary">
              No exams available
            </Typography>
          </Card>
        ) : (
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(350px, 1fr))",
              gap: 3,
            }}
          >
            {filteredExams.map((exam) => (
              <ExamItem
                key={exam.exam_id}
                exam={exam}
                onStart={handleStartExam}
                onLeave={handleLeaveExam}
                disabled={!isExamActive(exam)}
              />
            ))}
          </Box>
        )}
      </Box>
    </Layout>
  );
};
