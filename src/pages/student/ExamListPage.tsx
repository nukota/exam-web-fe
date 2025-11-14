import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  Card,
  CardContent,
  CardActions,
  Button,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Chip,
} from '@mui/material';
import { Assignment, Code, Timer, CalendarToday } from '@mui/icons-material';
import { Layout } from '../../components/common';
import { isExamActive } from '../../shared/utils';
import { mockExams } from '../../shared/mockdata';

export const StudentExamListPage = () => {
  const [accessCodeDialogOpen, setAccessCodeDialogOpen] = useState(false);
  const [accessCode, setAccessCode] = useState('');
  const navigate = useNavigate();

  const handleStartExam = (examId: string, examType: string) => {
    if (examType === 'coding') {
      navigate(`/student/exam/${examId}/coding`);
    } else {
      navigate(`/student/exam/${examId}/standard`);
    }
  };

  const handleJoinWithCode = () => {
    // In a real app, validate access code and fetch exam details
    const exam = mockExams.find(e => e.access_code === accessCode);
    if (exam) {
      handleStartExam(exam.exam_id, exam.type);
      setAccessCodeDialogOpen(false);
      setAccessCode('');
    } else {
      alert('Invalid access code');
    }
  };

  return (
    <Layout>
      <Box>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h4" component="h1" fontWeight="bold">
            Available Exams
          </Typography>
          <Button
            variant="contained"
            onClick={() => setAccessCodeDialogOpen(true)}
          >
            Join Exam with Code
          </Button>
        </Box>

        <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: 3 }}>
          {mockExams.map((exam) => (
            <Box key={exam.exam_id}>
              <Card elevation={3}>
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    {exam.type === 'coding' ? (
                      <Code color="primary" sx={{ mr: 1 }} />
                    ) : (
                      <Assignment color="primary" sx={{ mr: 1 }} />
                    )}
                    <Typography variant="h6" component="h2">
                      {exam.title}
                    </Typography>
                  </Box>
                  
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                    {exam.description}
                  </Typography>

                  <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mb: 2 }}>
                    <Chip
                      icon={<Timer />}
                      label={`${exam.duration_minutes} min`}
                      size="small"
                      variant="outlined"
                    />
                    <Chip
                      label={exam.type === 'coding' ? 'Coding' : 'Standard'}
                      size="small"
                      color={exam.type === 'coding' ? 'secondary' : 'primary'}
                    />
                  </Box>

                  {exam.start_at && (
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                      <CalendarToday fontSize="small" sx={{ mr: 1 }} />
                      <Typography variant="caption">
                        {new Date(exam.start_at).toLocaleString()}
                      </Typography>
                    </Box>
                  )}
                </CardContent>
                <CardActions>
                  <Button
                    variant="contained"
                    fullWidth
                    onClick={() => handleStartExam(exam.exam_id, exam.type)}
                    disabled={!isExamActive(exam)}
                  >
                    {isExamActive(exam) ? 'Start Exam' : 'Not Available'}
                  </Button>
                </CardActions>
              </Card>
            </Box>
          ))}
        </Box>

        <Dialog open={accessCodeDialogOpen} onClose={() => setAccessCodeDialogOpen(false)}>
          <DialogTitle>Join Exam with Access Code</DialogTitle>
          <DialogContent>
            <TextField
              autoFocus
              margin="dense"
              label="Access Code"
              fullWidth
              variant="outlined"
              value={accessCode}
              onChange={(e) => setAccessCode(e.target.value)}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setAccessCodeDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleJoinWithCode} variant="contained">
              Join
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </Layout>
  );
};
