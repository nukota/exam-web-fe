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
  LayoutDashboard,
  FileText,
  CheckSquare,
  Trophy,
} from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../shared/providers/AuthProvider";

interface NavItem {
  text: string;
  icon: React.ReactNode;
  path: string;
}

interface NavBarProps {
  role: "admin" | "student";
}

const adminNavItems: NavItem[] = [
  {
    text: "Dashboard",
    icon: <LayoutDashboard size={18} />,
    path: "/admin/dashboard",
  },
  { text: "All Exams", icon: <FileText size={18} />, path: "/admin/exams" },
  {
    text: "Grade Essays",
    icon: <CheckSquare size={18} />,
    path: "/admin/grading",
  },
  {
    text: "Leaderboard",
    icon: <Trophy size={18} />,
    path: "/admin/leaderboard",
  },
];

const studentNavItems: NavItem[] = [
  {
    text: "Available Exams",
    icon: <FileText size={18} />,
    path: "/student/exams",
  },
  { text: "My Results", icon: <Trophy size={18} />, path: "/student/results" },
];

export const NavBar: React.FC<NavBarProps> = ({ role }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const navItems = role === "admin" ? adminNavItems : studentNavItems;

  const isActive = (path: string) => {
    if (path === "/admin/dashboard" || path === "/student/exams") {
      return location.pathname === path;
    }
    return location.pathname.startsWith(path);
  };

  const { currentUser } = useAuth();

  return (
    <Box
      sx={{
        width: 240,
        height: "100%",
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* Logo Section */}
      <Box
        sx={{
          height: { xs: 54, sm: 60 },
          px: 2.5,
          display: "flex",
          alignItems: "center",
          gap: 1.5,
          borderBottom: 1,
          borderColor: "divider",
        }}
      >
        <Typography
          sx={{
        fontSize: 20,
        fontWeight: 800,
        color: "black",
        letterSpacing: '0.075em',
          }}
        >
          ExamWeb
        </Typography>
      </Box>

      {/* User Info Section */}
      <Box
        sx={{
          alignItems: "flex-start",
          flexDirection: "column",
          display: "flex",
          px: 2.5,
          py: 2,
          gap: 0.5,
          overflow: "hidden",
        }}
      >
        <Typography
          variant="body2"
          sx={{
            fontWeight: 800,
            color: "text.primary",
            fontSize: "1rem",
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
          }}
        >
          {currentUser?.full_name || currentUser?.username}
        </Typography>
        <Typography
          variant="caption"
          sx={{
            color: "text.secondary",
            fontSize: "0.875rem",
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
          }}
        >
          {currentUser?.email}
        </Typography>
      </Box>

      {/* Navigation Items */}
      <List sx={{ flex: 1, pt: 1.5, overflow: "auto" }}>
        {navItems.map((item) => (
          <ListItem key={item.text} disablePadding>
            <ListItemButton
              onClick={() => navigate(item.path)}
              sx={{
                mx: 1,
                py: 0.75,
                px: 1.5,
                borderRadius: 1,
                backgroundColor: isActive(item.path)
                  ? "rgba(0, 0, 0, 0.06)"
                  : "transparent",
                "&:hover": {
                  backgroundColor: "rgba(0, 0, 0, 0.04)",
                },
              }}
            >
              <ListItemIcon
                sx={{
                  minWidth: 32,
                  color: "text.secondary",
                }}
              >
                {item.icon}
              </ListItemIcon>
              <ListItemText
                primary={item.text}
                primaryTypographyProps={{
                  fontSize: "0.875rem",
                  fontWeight: isActive(item.path) ? 800 : 400,
                }}
              />
            </ListItemButton>
          </ListItem>
        ))}
      </List>

      {/* Footer */}
      <Box
        sx={{
          p: 1.5,
          m: 1.5,
          mt: 0,
          borderRadius: 1,
          backgroundColor: "rgba(0, 0, 0, 0.02)",
          border: "1px solid rgba(0, 0, 0, 0.06)",
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
