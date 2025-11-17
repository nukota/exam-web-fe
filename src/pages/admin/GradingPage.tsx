import { useState } from 'react';
import {
  Box,
  Typography,
  Paper,
  Button,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Chip,
} from '@mui/material';
import { Grading } from '@mui/icons-material';
import type { GridColDef } from '@mui/x-data-grid';
import { Layout, CustomDataGrid } from '../../components/common';

interface EssayAnswer {
  answer_id: string;
  student_name: string;
  exam_title: string;
  question_text: string;
  answer_text: string;
  max_points: number;
  current_score?: number;
}

// Mock data
const mockEssayAnswers: EssayAnswer[] = [
  {
    answer_id: '1',
    student_name: 'Alice Johnson',
    exam_title: 'Introduction to Computer Science',
    question_text: 'Explain the concept of recursion in programming.',
    answer_text:
      'Recursion is a programming technique where a function calls itself to solve a problem. It breaks down complex problems into simpler sub-problems. A recursive function must have a base case to stop the recursion and prevent infinite loops. For example, calculating factorial is a classic recursive problem.',
    max_points: 5,
  },
  {
    answer_id: '2',
    student_name: 'Bob Smith',
    exam_title: 'Data Structures',
    question_text: 'Describe the difference between a stack and a queue.',
    answer_text:
      'A stack follows LIFO (Last In First Out) principle while a queue follows FIFO (First In First Out). In a stack, elements are added and removed from the same end. In a queue, elements are added at one end and removed from the other end.',
    max_points: 3,
  },
];

export const AdminGradingPage = () => {
  const [answers, setAnswers] = useState(mockEssayAnswers);
  const [gradingDialogOpen, setGradingDialogOpen] = useState(false);
  const [currentAnswer, setCurrentAnswer] = useState<any>(null);
  const [score, setScore] = useState<string>('');

  const handleOpenGrading = (answer: any) => {
    setCurrentAnswer(answer);
    setScore(answer.current_score?.toString() || '');
    setGradingDialogOpen(true);
  };

  const handleSubmitGrade = () => {
    const updatedAnswers = answers.map((a) =>
      a.answer_id === currentAnswer.answer_id
        ? { ...a, current_score: parseFloat(score) }
        : a
    );
    setAnswers(updatedAnswers);
    setGradingDialogOpen(false);
    setCurrentAnswer(null);
    setScore('');
  };

  const pendingCount = answers.filter((a) => a.current_score === undefined).length;

  const columns: GridColDef[] = [
    {
      field: 'student_name',
      headerName: 'Student',
      flex: 1,
      minWidth: 150,
    },
    {
      field: 'exam_title',
      headerName: 'Exam',
      flex: 1,
      minWidth: 150,
    },
    {
      field: 'question_text',
      headerName: 'Question',
      flex: 2,
      minWidth: 200,
      renderCell: (params) => (
        <Typography variant="body2" sx={{ maxWidth: 300 }}>
          {params.value}
        </Typography>
      ),
    },
    {
      field: 'points',
      headerName: 'Points',
      width: 120,
      align: 'center',
      headerAlign: 'center',
      renderCell: (params) =>
        params.row.current_score !== undefined
          ? `${params.row.current_score} / ${params.row.max_points}`
          : `- / ${params.row.max_points}`,
    },
    {
      field: 'status',
      headerName: 'Status',
      width: 120,
      align: 'center',
      headerAlign: 'center',
      renderCell: (params) => (
        <Chip
          label={params.row.current_score !== undefined ? 'Graded' : 'Pending'}
          color={params.row.current_score !== undefined ? 'success' : 'warning'}
          size="small"
        />
      ),
    },
    {
      field: 'actions',
      headerName: 'Actions',
      width: 150,
      align: 'center',
      headerAlign: 'center',
      sortable: false,
      renderCell: (params) => (
        <Button
          size="small"
          variant="outlined"
          startIcon={<Grading />}
          onClick={() => handleOpenGrading(params.row)}
        >
          {params.row.current_score !== undefined ? 'Re-grade' : 'Grade'}
        </Button>
      ),
    },
  ];

  return (
    <Layout>
      <Box>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h4" component="h1" fontWeight="bold">
            Grade Essay Questions
          </Typography>
          <Chip
            icon={<Grading />}
            label={`${pendingCount} Pending`}
            color={pendingCount > 0 ? 'warning' : 'success'}
          />
        </Box>

        <CustomDataGrid
          rows={answers}
          columns={columns}
          getRowId={(row) => row.answer_id}
          pageSize={10}
          pageSizeOptions={[10, 20, 50]}
        />

        {/* Grading Dialog */}
        <Dialog
          open={gradingDialogOpen}
          onClose={() => setGradingDialogOpen(false)}
          maxWidth="md"
          fullWidth
        >
          <DialogTitle>Grade Essay Answer</DialogTitle>
          <DialogContent>
            {currentAnswer && (
              <>
                <Typography variant="subtitle2" gutterBottom>
                  Student: {currentAnswer.student_name}
                </Typography>
                <Typography variant="subtitle2" gutterBottom sx={{ mb: 2 }}>
                  Exam: {currentAnswer.exam_title}
                </Typography>

                <Paper sx={{ p: 2, mb: 2, bgcolor: 'grey.50' }}>
                  <Typography variant="subtitle2" fontWeight="bold" gutterBottom>
                    Question:
                  </Typography>
                  <Typography variant="body2">{currentAnswer.question_text}</Typography>
                </Paper>

                <Paper sx={{ p: 2, mb: 3, bgcolor: 'grey.50' }}>
                  <Typography variant="subtitle2" fontWeight="bold" gutterBottom>
                    Student Answer:
                  </Typography>
                  <Typography variant="body2">{currentAnswer.answer_text}</Typography>
                </Paper>

                <TextField
                  fullWidth
                  label="Score"
                  type="number"
                  value={score}
                  onChange={(e) => setScore(e.target.value)}
                  helperText={`Maximum points: ${currentAnswer.max_points}`}
                  inputProps={{ min: 0, max: currentAnswer.max_points, step: 0.5 }}
                />
              </>
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setGradingDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleSubmitGrade} variant="contained">
              Submit Grade
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </Layout>
  );
};
