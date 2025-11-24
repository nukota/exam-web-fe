import { Box, Typography } from "@mui/material";
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

export const AdminDashboardPage = () => {
  const stats = [
    { title: "Total Exams", value: 15, icon: <Assignment /> },
    { title: "Total Students", value: 250, icon: <People /> },
    { title: "Pending Grading", value: 8, icon: <Grading /> },
    { title: "Avg Score", value: "78%", icon: <TrendingUp /> },
  ];

  // Mock data for charts
  const examScoresData = [
    { date: "Nov 10", avgScore: 72 },
    { date: "Nov 12", avgScore: 75 },
    { date: "Nov 14", avgScore: 78 },
    { date: "Nov 16", avgScore: 76 },
    { date: "Nov 18", avgScore: 80 },
    { date: "Nov 20", avgScore: 82 },
    { date: "Nov 22", avgScore: 79 },
  ];

  const examTypeData = [
    { name: "Standard", value: 60 },
    { name: "Coding", value: 40 },
  ];

  const topExamsData = [
    { exam: "CS101", submissions: 45 },
    { exam: "PY202", submissions: 38 },
    { exam: "DS301", submissions: 32 },
    { exam: "WD401", submissions: 28 },
  ];

  const studentActivityData = [
    { date: "Nov 10", students: 120 },
    { date: "Nov 12", students: 135 },
    { date: "Nov 14", students: 142 },
    { date: "Nov 16", students: 138 },
    { date: "Nov 18", students: 155 },
    { date: "Nov 20", students: 160 },
    { date: "Nov 22", students: 158 },
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
          {stats.map((stat) => (
            <StatCard
              key={stat.title}
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
              <LineChart data={examScoresData}>
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
                  dataKey="avgScore"
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
                  data={examTypeData}
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
                  {examTypeData.map((_, index) => (
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
              <BarChart data={topExamsData}>
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
              <LineChart data={studentActivityData}>
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
