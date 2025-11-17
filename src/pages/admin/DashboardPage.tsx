import {
  Box,
  Typography,
} from '@mui/material';
import {
  Assignment,
  People,
  Grading,
  TrendingUp,
} from '@mui/icons-material';
import { Layout } from '../../components/common';
import StatCard from '../../components/admin/items/StatCard';
import Card from '../../components/common/Card';

export const AdminDashboardPage = () => {
  const stats = [
    { title: 'Total Exams', value: 15, icon: <Assignment /> },
    { title: 'Total Students', value: 250, icon: <People /> },
    { title: 'Pending Grading', value: 8, icon: <Grading /> },
    { title: 'Avg Score', value: '78%', icon: <TrendingUp /> },
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

        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: {
              xs: '1fr',
              sm: '1fr 1fr',
              md: 'repeat(4, 1fr)',
            },
            gap: 3,
            mb: 4,
          }}
        >
          {stats.map((stat) => (
            <StatCard
              key={stat.title}
              title={stat.title}
              value={stat.value}
              icon={stat.icon}
            />
          ))}
        </Box>

        <Card>
          <Typography variant="h6" gutterBottom fontWeight="bold">
            Recent Activity
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Recent exam submissions and student activities will appear here.
          </Typography>
        </Card>
      </Box>
    </Layout>
  );
};
