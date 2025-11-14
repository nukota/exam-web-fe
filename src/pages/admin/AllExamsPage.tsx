import { useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  Chip,
  IconButton,
} from '@mui/material';
import { Edit, Delete, Visibility, Add } from '@mui/icons-material';
import { Layout } from '../../components/common';
import { mockExams } from '../../shared/mockdata';

export const AdminExamsPage = () => {
  const navigate = useNavigate();

  const handleDelete = (examId: string) => {
    if (window.confirm('Are you sure you want to delete this exam?')) {
      console.log('Deleting exam:', examId);
      // Implement delete logic
    }
  };

  return (
    <Layout>
      <Box>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h4" component="h1" fontWeight="bold">
            All Exams
          </Typography>
          <Button
            variant="contained"
            startIcon={<Add />}
            onClick={() => navigate('/admin/exams/create')}
          >
            Create New Exam
          </Button>
        </Box>

        <Paper elevation={2}>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell><strong>Title</strong></TableCell>
                  <TableCell><strong>Type</strong></TableCell>
                  <TableCell><strong>Access Code</strong></TableCell>
                  <TableCell><strong>Duration</strong></TableCell>
                  <TableCell><strong>Start Time</strong></TableCell>
                  <TableCell align="center"><strong>Actions</strong></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {mockExams.map((exam) => (
                  <TableRow key={exam.exam_id}>
                    <TableCell>
                      <Typography variant="body1" fontWeight="medium">
                        {exam.title}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {exam.description}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={exam.type === 'coding' ? 'Coding' : 'Standard'}
                        color={exam.type === 'coding' ? 'secondary' : 'primary'}
                        size="small"
                      />
                    </TableCell>
                    <TableCell>
                      <Chip label={exam.access_code} variant="outlined" size="small" />
                    </TableCell>
                    <TableCell>{exam.duration_minutes} min</TableCell>
                    <TableCell>
                      {exam.start_at ? new Date(exam.start_at).toLocaleString() : 'N/A'}
                    </TableCell>
                    <TableCell align="center">
                      <IconButton
                        size="small"
                        color="info"
                        onClick={() => navigate(`/admin/exams/${exam.exam_id}/leaderboard`)}
                      >
                        <Visibility />
                      </IconButton>
                      <IconButton
                        size="small"
                        color="primary"
                        onClick={() => navigate(`/admin/exams/${exam.exam_id}/edit`)}
                      >
                        <Edit />
                      </IconButton>
                      <IconButton
                        size="small"
                        color="error"
                        onClick={() => handleDelete(exam.exam_id)}
                      >
                        <Delete />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
      </Box>
    </Layout>
  );
};
