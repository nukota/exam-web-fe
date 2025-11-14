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
} from '@mui/material';
import { EmojiEvents } from '@mui/icons-material';
import { Layout } from '../../components/common';
import { mockLeaderboardData } from '../../shared/mockdata';

export const AdminLeaderboardPage = () => {
  // const { examId } = useParams(); // For future use to fetch exam-specific leaderboard

  return (
    <Layout>
      <Box>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
          <EmojiEvents color="warning" sx={{ mr: 1, fontSize: '2rem' }} />
          <Typography variant="h4" component="h1" fontWeight="bold">
            Exam Leaderboard
          </Typography>
        </Box>

        <Paper elevation={2} sx={{ p: 2, mb: 3 }}>
          <Typography variant="h6">Introduction to Computer Science</Typography>
          <Typography variant="body2" color="text.secondary">
            {mockLeaderboardData.length} students have submitted
          </Typography>
        </Paper>

        <Paper elevation={2}>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell><strong>Rank</strong></TableCell>
                  <TableCell><strong>Student Name</strong></TableCell>
                  <TableCell><strong>Email</strong></TableCell>
                  <TableCell align="center"><strong>Score</strong></TableCell>
                  <TableCell align="right"><strong>Submitted At</strong></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {mockLeaderboardData.map((entry) => (
                  <TableRow key={entry.rank}>
                    <TableCell>
                      {entry.rank <= 3 ? (
                        <Chip
                          label={entry.rank}
                          color={entry.rank === 1 ? 'warning' : 'default'}
                          size="small"
                          sx={{ fontWeight: 'bold' }}
                        />
                      ) : (
                        <Typography>{entry.rank}</Typography>
                      )}
                    </TableCell>
                    <TableCell>
                      <Typography fontWeight={entry.rank <= 3 ? 'bold' : 'normal'}>
                        {entry.name}
                      </Typography>
                    </TableCell>
                    <TableCell>{entry.email}</TableCell>
                    <TableCell align="center">
                      <Typography fontWeight="bold" color="primary">
                        {entry.score}
                      </Typography>
                    </TableCell>
                    <TableCell align="right">
                      {new Date(entry.submitted_at).toLocaleString()}
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
