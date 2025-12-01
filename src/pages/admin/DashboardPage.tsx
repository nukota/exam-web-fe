import { Box, Typography, CircularProgress, Alert } from "@mui/material";
import { Assignment, People, Grading, TrendingUp } from "@mui/icons-material";
import { Layout } from "../../components/common";
import StatCard from "../../components/admin/items/StatCard";
import Card from "../../components/common/Card";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { useDashboard } from "../../services/dashboardService";

export const AdminDashboardPage = () => {
  const { data: dashboardData, isLoading, error } = useDashboard();

  if (isLoading) {
    return (
      <Layout>
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "50vh",
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
        <Box sx={{ p: 3 }}>
          <Alert severity="error">
            Failed to load dashboard data. Please try again later.
          </Alert>
        </Box>
      </Layout>
    );
  }

  if (!dashboardData) {
    return (
      <Layout>
        <Box sx={{ p: 3 }}>
          <Alert severity="info">No dashboard data available.</Alert>
        </Box>
      </Layout>
    );
  }

  const stats = [
    {
      title: "Total Exams",
      value: dashboardData.total_exams,
      icon: <Assignment />,
    },
    {
      title: "Total Students",
      value: dashboardData.total_students,
      icon: <People />,
    },
    {
      title: "Pending Grading",
      value: dashboardData.pending_grading,
      icon: <Grading />,
    },
    {
      title: "Avg Score",
      value: dashboardData.avg_score,
      icon: <TrendingUp />,
    },
  ];

  // Use data from API
  const {
    exam_scores_data,
    exam_type_data,
    top_exams_data,
    student_activity_data,
  } = dashboardData;

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
            display: "grid",
            gridTemplateColumns: {
              xs: "1fr",
              sm: "1fr 1fr",
              md: "repeat(4, 1fr)",
            },
            gap: 3,
            mb: 4,
          }}
        >
          {stats.map((stat, index: number) => (
            <StatCard
              key={index}
              title={stat.title}
              value={stat.value}
              icon={stat.icon}
            />
          ))}
        </Box>

        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: { xs: "1fr", lg: "2fr 1fr" },
            gap: 3,
            mb: 3,
          }}
        >
          {/* Average Scores Line Chart */}
          <Card sx={{ p: 3 }}>
            <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
              <Box
                sx={{
                  width: 40,
                  height: 40,
                  borderRadius: 2,
                  background:
                    "linear-gradient(135deg, #4caf50 0%, #81c784 100%)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  mr: 2,
                }}
              >
                <TrendingUp sx={{ color: "white" }} />
              </Box>
              <Typography variant="h6" fontWeight={700}>
                Average Scores Trend
              </Typography>
            </Box>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={exam_scores_data}>
                <defs>
                  <linearGradient
                    id="scoreGradient"
                    x1="0"
                    y1="0"
                    x2="0"
                    y2="1"
                  >
                    <stop offset="5%" stopColor="#4caf50" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="#4caf50" stopOpacity={0.1} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
                <XAxis dataKey="date" stroke="#666" />
                <YAxis stroke="#666" domain={[0, 100]} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "rgba(255, 255, 255, 0.95)",
                    border: "1px solid #e0e0e0",
                    borderRadius: 8,
                  }}
                />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="avg_score"
                  stroke="#4caf50"
                  strokeWidth={3}
                  dot={{ fill: "#4caf50", r: 3 }}
                  activeDot={{ r: 5 }}
                  name="Average Score"
                />
              </LineChart>
            </ResponsiveContainer>
          </Card>

          {/* Exam Type Distribution Pie Chart */}
          <Card sx={{ p: 3 }}>
            <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
              <Box
                sx={{
                  width: 40,
                  height: 40,
                  borderRadius: 2,
                  background:
                    "linear-gradient(135deg, #ff9800 0%, #ffb74d 100%)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  mr: 2,
                }}
              >
                <Assignment sx={{ color: "white" }} />
              </Box>
              <Typography variant="h6" fontWeight={700}>
                Exam Types
              </Typography>
            </Box>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={exam_type_data as any}
                  cx="50%"
                  cy="45%"
                  labelLine={false}
                  label={({ name, percent }) =>
                    `${name} ${percent ? (percent * 100).toFixed(0) : 0}%`
                  }
                  outerRadius={90}
                  innerRadius={54}
                  dataKey="value"
                  cornerRadius={7}
                >
                  {exam_type_data.map((_entry: any, index: number) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={["#667eea", "#00d4ff"][index % 2]}
                    />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: "rgba(255, 255, 255, 0.95)",
                    border: "1px solid #e0e0e0",
                    borderRadius: 8,
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </Card>
        </Box>

        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: { xs: "1fr", lg: "1fr 2fr" },
            gap: 3,
          }}
        >
          {/* Top Exams Bar Chart */}
          <Card sx={{ p: 3 }}>
            <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
              <Box
                sx={{
                  width: 40,
                  height: 40,
                  borderRadius: 2,
                  background:
                    "linear-gradient(135deg, #9c27b0 0%, #ba68c8 100%)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  mr: 2,
                }}
              >
                <Grading sx={{ color: "white" }} />
              </Box>
              <Typography variant="h6" fontWeight={700}>
                Top Exams
              </Typography>
            </Box>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={top_exams_data}>
                <defs>
                  <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#9c27b0" stopOpacity={0.9} />
                    <stop offset="95%" stopColor="#ce93d8" stopOpacity={0.6} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
                <XAxis dataKey="exam" stroke="#666" />
                <YAxis stroke="#666" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "rgba(255, 255, 255, 0.95)",
                    border: "1px solid #e0e0e0",
                    borderRadius: 8,
                  }}
                />
                <Legend />
                <Bar
                  dataKey="submissions"
                  fill="url(#barGradient)"
                  radius={[8, 8, 0, 0]}
                  maxBarSize={30}
                  name="Submissions"
                />
              </BarChart>
            </ResponsiveContainer>
          </Card>

          {/* Student Activity Line Chart */}
          <Card sx={{ p: 3 }}>
            <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
              <Box
                sx={{
                  width: 40,
                  height: 40,
                  borderRadius: 2,
                  background:
                    "linear-gradient(135deg, #2196f3 0%, #64b5f6 100%)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  mr: 2,
                }}
              >
                <People sx={{ color: "white" }} />
              </Box>
              <Typography variant="h6" fontWeight={700}>
                Active Students
              </Typography>
            </Box>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={student_activity_data}>
                <defs>
                  <linearGradient
                    id="studentsGradient"
                    x1="0"
                    y1="0"
                    x2="0"
                    y2="1"
                  >
                    <stop offset="5%" stopColor="#2196f3" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="#2196f3" stopOpacity={0.1} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
                <XAxis dataKey="date" stroke="#666" />
                <YAxis stroke="#666" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "rgba(255, 255, 255, 0.95)",
                    border: "1px solid #e0e0e0",
                    borderRadius: 8,
                  }}
                />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="students"
                  stroke="#2196f3"
                  strokeWidth={3}
                  dot={{ fill: "#2196f3", r: 3 }}
                  activeDot={{ r: 5 }}
                  name="Active Students"
                />
              </LineChart>
            </ResponsiveContainer>
          </Card>
        </Box>
      </Box>
    </Layout>
  );
};
