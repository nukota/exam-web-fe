import {
  Box,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
} from "@mui/material";
import {
  SchoolRounded,
  DashboardRounded,
  AssignmentRounded,
  AddRounded,
  GradingRounded,
  LeaderboardRounded,
  PersonRounded,
} from "@mui/icons-material";
import { useNavigate, useLocation } from "react-router-dom";

interface NavItem {
  text: string;
  icon: React.ReactNode;
  path: string;
}

interface NavBarProps {
  role: 'admin' | 'student';
}

const adminNavItems: NavItem[] = [
  { text: "Dashboard", icon: <DashboardRounded />, path: "/admin/dashboard" },
  { text: "All Exams", icon: <AssignmentRounded />, path: "/admin/exams" },
  { text: "Create Exam", icon: <AddRounded />, path: "/admin/exams/create" },
  { text: "Grade Essays", icon: <GradingRounded />, path: "/admin/grading" },
  { text: "Leaderboard", icon: <LeaderboardRounded />, path: "/admin/leaderboard" },
];

const studentNavItems: NavItem[] = [
  { text: "Available Exams", icon: <AssignmentRounded />, path: "/student/exams" },
  { text: "My Results", icon: <LeaderboardRounded />, path: "/student/results" },
];

const getProfileItem = (role: 'admin' | 'student'): NavItem => ({
  text: "Profile",
  icon: <PersonRounded />,
  path: role === 'admin' ? "/admin/profile" : "/student/profile",
});

export const NavBar: React.FC<NavBarProps> = ({ role }) => {
  const navigate = useNavigate();
  const location = useLocation();
  
  const navItems = role === 'admin' ? adminNavItems : studentNavItems;
  const profileItem = getProfileItem(role);

  const isActive = (path: string) => {
    if (path === "/admin/dashboard" || path === "/student/exams") {
      return location.pathname === path;
    }
    return location.pathname.startsWith(path);
  };
  
  return (
    <Box
      sx={{
        width: 250,
        height: "100%",
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* Logo Section */}
      <Box
        sx={{
          height: { xs: 60, sm: 66 },
          px: 3,
          display: "flex",
          alignItems: "center",
          gap: 1.5,
          borderBottom: 1,
          borderColor: "divider",
        }}
      >
        <SchoolRounded sx={{ fontSize: 28, color: "primary.main" }} />
        <Typography
          sx={{
            fontSize: 20,
            fontWeight: 600,
            color: "primary.main",
          }}
        >
          ExamWeb
        </Typography>
      </Box>

      {/* Navigation Items */}
      <List sx={{ flex: 1, pt: 2, overflow: "auto" }}>
        {navItems.map((item) => (
          <ListItem key={item.text} disablePadding>
            <ListItemButton
              onClick={() => navigate(item.path)}
              sx={{
                mx: 1,
                px: 2,
                borderRadius: 1,
                backgroundColor: isActive(item.path)
                  ? "rgba(25, 118, 210, 0.08)"
                  : "transparent",
                color: isActive(item.path) ? "primary.main" : "text.primary",
                "&:hover": {
                  backgroundColor: isActive(item.path)
                    ? "rgba(25, 118, 210, 0.12)"
                    : "action.hover",
                },
              }}
            >
              <ListItemIcon
                sx={{
                  minWidth: 40,
                  color: isActive(item.path)
                    ? "primary.main"
                    : "text.secondary",
                }}
              >
                {item.icon}
              </ListItemIcon>
              <ListItemText
                primary={item.text}
                primaryTypographyProps={{
                  fontSize: "0.95rem",
                  fontWeight: isActive(item.path) ? 600 : 500,
                }}
              />
            </ListItemButton>
          </ListItem>
        ))}
      </List>

      {/* Profile Item at Bottom */}
      <List sx={{ pt: 0 }}>
        <ListItem disablePadding>
          <ListItemButton
            onClick={() => navigate(profileItem.path)}
            sx={{
              mx: 1,
              px: 2,
              borderRadius: 1,
              backgroundColor: isActive(profileItem.path)
                ? "rgba(25, 118, 210, 0.08)"
                : "transparent",
              color: isActive(profileItem.path)
                ? "primary.main"
                : "text.primary",
              "&:hover": {
                backgroundColor: isActive(profileItem.path)
                  ? "rgba(25, 118, 210, 0.12)"
                  : "action.hover",
              },
            }}
          >
            <ListItemIcon
              sx={{
                minWidth: 40,
                color: isActive(profileItem.path)
                  ? "primary.main"
                  : "text.secondary",
              }}
            >
              {profileItem.icon}
            </ListItemIcon>
            <ListItemText
              primary={profileItem.text}
              primaryTypographyProps={{
                fontSize: "0.95rem",
                fontWeight: isActive(profileItem.path) ? 600 : 500,
              }}
            />
          </ListItemButton>
        </ListItem>
      </List>

      {/* Footer */}
      <Box
        sx={{
          p: 1.5,
          m: 2,
          mt: 0,
          borderRadius: 1,
          backgroundColor: "rgba(25, 118, 210, 0.04)",
          border: "1px solid rgba(25, 118, 210, 0.1)",
        }}
      >
        <Typography
          variant="caption"
          sx={{
            color: "text.secondary",
            fontWeight: 500,
            display: "block",
            textAlign: "center",
            lineHeight: 1.4,
          }}
        >
          ExamWeb © 2025
        </Typography>
      </Box>
    </Box>
  );
};
