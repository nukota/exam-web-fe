import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  Paper,
  Button,
  Radio,
  RadioGroup,
  FormControlLabel,
  Checkbox,
  FormGroup,
  TextField,
  LinearProgress,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import { Timer, Flag, Send } from '@mui/icons-material';
import { Layout } from '../../components/common';
import { mockQuestionsExam1 } from '../../shared/mockdata';

export const StudentStandardExamPage = () => {
  const { examId } = useParams();
  const navigate = useNavigate();
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, any>>({});
  const [timeRemaining, setTimeRemaining] = useState(3600); // 60 minutes in seconds
  const [flaggedQuestions, setFlaggedQuestions] = useState<Set<string>>(new Set());
  const [submitDialogOpen, setSubmitDialogOpen] = useState(false);

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

  const currentQuestion = mockQuestionsExam1[currentQuestionIndex];

  const handleAnswerChange = (questionId: string, value: any) => {
    setAnswers({ ...answers, [questionId]: value });
  };

  const handleToggleFlag = (questionId: string) => {
    const newFlagged = new Set(flaggedQuestions);
    if (newFlagged.has(questionId)) {
      newFlagged.delete(questionId);
    } else {
      newFlagged.add(questionId);
    }
    setFlaggedQuestions(newFlagged);
  };

  const handleSubmit = () => {
    // In a real app, submit answers to the backend
    console.log('Submitting answers:', answers);
    navigate(`/student/exam/${examId}/result`);
  };

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const progress = ((currentQuestionIndex + 1) / mockQuestionsExam1.length) * 100;

  return (
    <Layout>
      <Box>
        {/* Header */}
        <Paper elevation={2} sx={{ p: 2, mb: 3 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography variant="h5" fontWeight="bold">
              Introduction to Computer Science
            </Typography>
            <Chip
              icon={<Timer />}
              label={formatTime(timeRemaining)}
              color={timeRemaining < 300 ? 'error' : 'primary'}
            />
          </Box>
          <LinearProgress variant="determinate" value={progress} />
          <Typography variant="caption" sx={{ mt: 1, display: 'block' }}>
            Question {currentQuestionIndex + 1} of {mockQuestionsExam1.length}
          </Typography>
        </Paper>

        {/* Question */}
        <Paper elevation={2} sx={{ p: 3, mb: 3 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', mb: 3 }}>
            <Box sx={{ flex: 1 }}>
              <Typography variant="h6" gutterBottom>
                Question {currentQuestionIndex + 1}
              </Typography>
              <Typography variant="body1" sx={{ mb: 2 }}>
                {currentQuestion.question_text}
              </Typography>
              <Chip label={`${currentQuestion.points} points`} size="small" />
            </Box>
            <Button
              startIcon={<Flag />}
              onClick={() => handleToggleFlag(currentQuestion.question_id)}
              color={flaggedQuestions.has(currentQuestion.question_id) ? 'warning' : 'inherit'}
            >
              {flaggedQuestions.has(currentQuestion.question_id) ? 'Flagged' : 'Flag'}
            </Button>
          </Box>

          {/* Answer Input Based on Question Type */}
          {currentQuestion.question_type === 'single_choice' && (
            <RadioGroup
              value={answers[currentQuestion.question_id] || ''}
              onChange={(e) => handleAnswerChange(currentQuestion.question_id, e.target.value)}
            >
              {currentQuestion.choices?.map((choice) => (
                <FormControlLabel
                  key={choice.choice_id}
                  value={choice.choice_id}
                  control={<Radio />}
                  label={choice.choice_text}
                />
              ))}
            </RadioGroup>
          )}

          {currentQuestion.question_type === 'multiple_choice' && (
            <FormGroup>
              {currentQuestion.choices?.map((choice) => (
                <FormControlLabel
                  key={choice.choice_id}
                  control={
                    <Checkbox
                      checked={(answers[currentQuestion.question_id] || []).includes(choice.choice_id)}
                      onChange={(e) => {
                        const current = answers[currentQuestion.question_id] || [];
                        const newValue = e.target.checked
                          ? [...current, choice.choice_id]
                          : current.filter((id: string) => id !== choice.choice_id);
                        handleAnswerChange(currentQuestion.question_id, newValue);
                      }}
                    />
                  }
                  label={choice.choice_text}
                />
              ))}
            </FormGroup>
          )}

          {currentQuestion.question_type === 'short_answer' && (
            <TextField
              fullWidth
              variant="outlined"
              placeholder="Type your answer here"
              value={answers[currentQuestion.question_id] || ''}
              onChange={(e) => handleAnswerChange(currentQuestion.question_id, e.target.value)}
            />
          )}

          {currentQuestion.question_type === 'essay' && (
            <TextField
              fullWidth
              multiline
              rows={8}
              variant="outlined"
              placeholder="Write your essay here..."
              value={answers[currentQuestion.question_id] || ''}
              onChange={(e) => handleAnswerChange(currentQuestion.question_id, e.target.value)}
            />
          )}
        </Paper>

        {/* Navigation */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', gap: 2 }}>
          <Button
            variant="outlined"
            disabled={currentQuestionIndex === 0}
            onClick={() => setCurrentQuestionIndex(currentQuestionIndex - 1)}
          >
            Previous
          </Button>
          <Box sx={{ display: 'flex', gap: 2 }}>
            {currentQuestionIndex < mockQuestionsExam1.length - 1 ? (
              <Button
                variant="contained"
                onClick={() => setCurrentQuestionIndex(currentQuestionIndex + 1)}
              >
                Next
              </Button>
            ) : (
              <Button
                variant="contained"
                color="success"
                startIcon={<Send />}
                onClick={() => setSubmitDialogOpen(true)}
              >
                Submit Exam
              </Button>
            )}
          </Box>
        </Box>

        {/* Submit Confirmation Dialog */}
        <Dialog open={submitDialogOpen} onClose={() => setSubmitDialogOpen(false)}>
          <DialogTitle>Submit Exam?</DialogTitle>
          <DialogContent>
            <Typography>
              Are you sure you want to submit your exam? You have answered{' '}
              {Object.keys(answers).length} out of {mockQuestionsExam1.length} questions.
            </Typography>
            {flaggedQuestions.size > 0 && (
              <Typography color="warning.main" sx={{ mt: 2 }}>
                You have {flaggedQuestions.size} flagged question(s) for review.
              </Typography>
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setSubmitDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleSubmit} variant="contained" color="success">
              Submit
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </Layout>
  );
};
