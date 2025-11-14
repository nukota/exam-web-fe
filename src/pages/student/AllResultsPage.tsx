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
  Chip,
  Button,
} from '@mui/material';
import { CheckCircle, Cancel, Visibility } from '@mui/icons-material';
import { Layout } from '../../components/common';
import { calculatePercentage } from '../../shared/utils';
import { useNavigate } from 'react-router-dom';
import { mockResults } from '../../shared/mockdata';

export const StudentAllResultsPage = () => {
  const navigate = useNavigate();

  return (
    <Layout>
      <Box>
        <Typography variant="h4" component="h1" fontWeight="bold" gutterBottom>
          My Exam Results
        </Typography>

        <Paper elevation={2} sx={{ mt: 3 }}>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell><strong>Exam Title</strong></TableCell>
                  <TableCell align="center"><strong>Score</strong></TableCell>
                  <TableCell align="center"><strong>Percentage</strong></TableCell>
                  <TableCell align="center"><strong>Status</strong></TableCell>
                  <TableCell align="right"><strong>Submitted At</strong></TableCell>
                  <TableCell align="center"><strong>Actions</strong></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {mockResults.map((result) => {
                  const percentage = calculatePercentage(result.score, result.maxScore);
                  return (
                    <TableRow key={result.exam_id}>
                      <TableCell>{result.title}</TableCell>
                      <TableCell align="center">
                        <Typography fontWeight="bold">
                          {result.score} / {result.maxScore}
                        </Typography>
                      </TableCell>
                      <TableCell align="center">
                        <Typography 
                          color={result.passed ? 'success.main' : 'error.main'}
                          fontWeight="bold"
                        >
                          {percentage}%
                        </Typography>
                      </TableCell>
                      <TableCell align="center">
                        <Chip
                          icon={result.passed ? <CheckCircle /> : <Cancel />}
                          label={result.passed ? 'Passed' : 'Not Passed'}
                          color={result.passed ? 'success' : 'error'}
                          size="small"
                        />
                      </TableCell>
                      <TableCell align="right">
                        {new Date(result.submitted_at).toLocaleString()}
                      </TableCell>
                      <TableCell align="center">
                        <Button
                          size="small"
                          variant="outlined"
                          startIcon={<Visibility />}
                          onClick={() => navigate(`/student/exam/${result.exam_id}/result`)}
                        >
                          View
                        </Button>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>

        {mockResults.length === 0 && (
          <Paper elevation={2} sx={{ p: 4, mt: 3, textAlign: 'center' }}>
            <Typography variant="h6" color="text.secondary">
              No exam results yet
            </Typography>
            <Button 
              variant="contained" 
              sx={{ mt: 2 }}
              onClick={() => navigate('/student/exams')}
            >
              Take an Exam
            </Button>
          </Paper>
        )}
      </Box>
    </Layout>
  );
};
