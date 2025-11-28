import {
  Box,
  IconButton,
  Avatar,
  Menu,
  MenuItem,
  Divider,
  ListItemIcon,
  Typography,
  Alert,
} from "@mui/material";
import {
  AccountCircleRounded,
  LogoutRounded,
  MenuRounded,
} from "@mui/icons-material";
import { Calendar, Bell } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCurrentUser, useSignOut } from "../../services/authService";

interface HeaderProps {
  onMenuClick: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onMenuClick }) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const navigate = useNavigate();
  const { data: currentUser } = useCurrentUser();
  const signOut = useSignOut();
  console.log("This is rendering Header component");

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleSignOut = async () => {
    try {
      await signOut.mutateAsync();
      handleClose();
      navigate("/signin");
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  const handleProfile = () => {
    handleClose();
    const profilePath =
      currentUser?.role === "admin" || currentUser?.role === "teacher"
        ? "/admin/profile"
        : "/student/profile";
    navigate(profilePath);
  };

  // Check if user profile is incomplete
  const isProfileIncomplete =
    currentUser &&
    (currentUser.role === "admin" || currentUser.role === "teacher"
      ? !currentUser.school_name
      : !currentUser.dob ||
        !currentUser.class_name ||
        !currentUser.school_name);

  return (
    <Box
      sx={{
        width: "100%",
        backgroundColor: "background.paper",
        overflowX: "hidden",
        borderBottom: 1,
        borderColor: "divider",
      }}
    >
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          gap: { xs: 1, lg: 2 },
          height: 60,
          px: 3,
        }}
      >
        {/* Menu Button for Mobile */}
        <IconButton
          color="default"
          onClick={onMenuClick}
          sx={{ display: { xs: "block", md: "none" }, p: 1.25 }}
        >
          <MenuRounded sx={{ fontSize: 28 }} />
        </IconButton>

        {/* Spacer */}
        <Box sx={{ flex: 1 }} />

        {/* Icon Buttons */}
        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          <IconButton sx={{ color: "text.secondary" }}>
            <Calendar size={24} />
          </IconButton>
          <IconButton sx={{ color: "text.secondary" }}>
            <Bell size={24} />
          </IconButton>
          <IconButton onClick={handleClick} size="small">
            <Avatar
              sx={{ width: 36, height: 36, bgcolor: "primary.main" }}
              src={currentUser?.photo_url}
            >
              {currentUser?.full_name?.charAt(0) || "U"}
            </Avatar>
          </IconButton>
        </Box>

        {/* Profile Menu */}
        <Menu
          anchorEl={anchorEl}
          open={open}
          onClose={handleClose}
          transformOrigin={{ horizontal: "right", vertical: "top" }}
          anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
          PaperProps={{
            sx: {
              boxShadow: "0px 8px 20px 0px rgba(60, 60, 60, 0.10)",
              border: "1px solid #e0e0e0",
              borderRadius: 3,
              mt: -1,
            },
          }}
        >
          <MenuItem onClick={handleProfile}>
            <ListItemIcon>
              <AccountCircleRounded fontSize="small" />
            </ListItemIcon>
            Profile
          </MenuItem>
          <Divider />
          <MenuItem onClick={handleSignOut}>
            <ListItemIcon>
              <LogoutRounded fontSize="small" />
            </ListItemIcon>
            Sign Out
          </MenuItem>
        </Menu>
      </Box>
      {isProfileIncomplete && (
        <Alert
          severity="warning"
          sx={{
            borderRadius: 0,
            borderTop: 1,
            borderColor: "divider",
            "& .MuiAlert-message": {
              width: "100%",
              textAlign: "left",
            },
          }}
        >
          <Typography variant="body2">
            Please complete your profile information.{" "}
            <Typography
              component="span"
              variant="body2"
              sx={{
                cursor: "pointer",
                textDecoration: "underline",
                fontWeight: 600,
              }}
              onClick={handleProfile}
            >
              Update Profile
            </Typography>
          </Typography>
        </Alert>
      )}
    </Box>
  );
};
