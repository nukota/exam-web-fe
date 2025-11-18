import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Typography,
  Button,
  TextField,
  Select,
  MenuItem,
} from "@mui/material";
import { Layout } from "../../components/common";
import ExamItem from "../../components/student/items/ExamItem";
import { isExamActive } from "../../shared/utils";
import { mockExams } from "../../shared/mockdata";

export const StudentExamListPage = () => {
  const [accessCode, setAccessCode] = useState("");
  const [selectedType, setSelectedType] = useState("all");
  const navigate = useNavigate();

  const handleStartExam = (examId: string, examType: string) => {
    if (examType === "coding") {
      navigate(`/student/exam/coding/${examId}`);
    } else {
      navigate(`/student/exam/${examId}`);
    }
  };

  const filteredExams = mockExams.filter(
    (exam) => selectedType === "all" || exam.type === selectedType
  );

  const handleJoinWithCode = () => {
    const exam = mockExams.find(
      (e) => e.exam_id === accessCode || e.access_code === accessCode
    );
    if (exam) {
      handleStartExam(exam.exam_id, exam.type);
    } else {
      // Assume accessCode is exam_id, use selectedType
      // handleStartExam(accessCode);
      handleStartExam("1", "standard");
    }
    setAccessCode("");
  };

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
          />
          <Select
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
            size="small"
            displayEmpty
          >
            <MenuItem value="all">All Exams</MenuItem>
            <MenuItem value="standard">Standard</MenuItem>
            <MenuItem value="coding">Coding</MenuItem>
          </Select>
          <Button variant="contained" onClick={handleJoinWithCode}>
            Join Exam
          </Button>
        </Box>

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
              disabled={!isExamActive(exam)}
            />
          ))}
        </Box>
      </Box>
    </Layout>
  );
};
