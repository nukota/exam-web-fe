import {
  Box,
  Typography,
  Paper,
  Card,
  CardContent,
} from '@mui/material';
import {
  Assignment,
  People,
  Grading,
  TrendingUp,
} from '@mui/icons-material';
import { Layout } from '../../components/common';

export const AdminDashboardPage = () => {
  const stats = [
    { title: 'Total Exams', value: 15, icon: <Assignment />, color: 'primary.main' },
    { title: 'Total Students', value: 250, icon: <People />, color: 'success.main' },
    { title: 'Pending Grading', value: 8, icon: <Grading />, color: 'warning.main' },
    { title: 'Avg Score', value: '78%', icon: <TrendingUp />, color: 'info.main' },
  ];

  return (
    <Layout>
      <Box>
        <Typography variant="h4" component="h1" fontWeight="bold" gutterBottom>
          Dashboard
        </Typography>
        <Typography variant="body1" color="text.secondary" paragraph>
          Welcome back! Here's an overview of your exam platform.
        </Typography>

        <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: 3, mb: 4 }}>
          {stats.map((stat, index) => (
            <Card key={index} elevation={3}>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <Box>
                    <Typography variant="h4" fontWeight="bold" color={stat.color}>
                      {stat.value}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {stat.title}
                    </Typography>
                  </Box>
                  <Box sx={{ color: stat.color, fontSize: '3rem' }}>
                    {stat.icon}
                  </Box>
                </Box>
              </CardContent>
            </Card>
          ))}
        </Box>

        <Paper elevation={2} sx={{ p: 3 }}>
          <Typography variant="h6" gutterBottom fontWeight="bold">
            Recent Activity
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Recent exam submissions and student activities will appear here.
          </Typography>
        </Paper>
      </Box>
    </Layout>
  );
};
