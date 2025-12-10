import { useState } from "react";
import {
  Box,
  Typography,
  TextField,
  Button,
  Avatar,
  IconButton,
  Stack,
} from "@mui/material";
import { Edit } from "@mui/icons-material";
import { ArrowLeft, User } from "lucide-react";
import { Layout } from "../../components/common";
import { useCurrentUser } from "../../services/authService";
import { useUpdateProfile } from "../../services/usersService";
import { useNavigate } from "react-router-dom";
import Card from "../../components/common/Card";
import { useFeedback } from "../../shared/providers/FeedbackProvider";

export const AdminProfilePage = () => {
  const { data: currentUser } = useCurrentUser();
  const navigate = useNavigate();
  const updateProfile = useUpdateProfile();
  const { showSnackbar } = useFeedback();
  const [isEditing, setIsEditing] = useState(false);
  const [profile, setProfile] = useState({
    school_name: currentUser?.school_name || "",
  });

  const handleSave = () => {
    const updateData = Object.fromEntries(
      Object.entries(profile).filter(
        ([_, value]) => value !== "" && value !== null && value !== undefined
      )
    );
    updateProfile.mutate(updateData, {
      onSuccess: () => {
        setIsEditing(false);
        showSnackbar({
          message: "Profile updated successfully",
          severity: "success",
        });
      },
      onError: (error: any) => {
        showSnackbar({
          message: error.message || "Failed to update profile",
          severity: "error",
        });
      },
    });
  };

  return (
    <Layout>
      <Box>
        <Box sx={{ display: "flex", alignItems: "center", mb: 3, gap: 1 }}>
          <IconButton onClick={() => navigate("/admin/dashboard")}>
            <ArrowLeft size={32} color="black" />
          </IconButton>
          <Typography
            variant="h4"
            component="h1"
            fontWeight="bold"
            sx={{ mr: 1 }}
          >
            My Profile
          </Typography>
          <User size={28} color="#999" />
        </Box>

        <Box sx={{ px: { xs: 0, md: "5%", lg: "15%", xl: "25%" } }}>
          <Card sx={{ p: 4, mt: 3 }}>
            <Box sx={{ display: "flex", alignItems: "center", mb: 4 }}>
              <Box sx={{ position: "relative" }}>
                <Avatar
                  sx={{
                    width: 100,
                    height: 100,
                    fontSize: "2.5rem",
                    bgcolor: "primary.main",
                  }}
                  src={currentUser?.photo_url}
                >
                  {currentUser?.full_name?.charAt(0)}
                </Avatar>
              </Box>
              <Box
                sx={{
                  ml: 3,
                  flex: 1,
                  display: "flex",
                  flexDirection: "column",
                  gap: 0.25,
                  textAlign: "left",
                }}
              >
                <Typography variant="h5" fontWeight="bold">
                  {currentUser?.full_name}
                </Typography>
                <Typography variant="body1" color="text.secondary">
                  {currentUser?.email}
                </Typography>
                <Typography variant="body1" color="text.secondary">
                  Role: {currentUser?.role === "admin" ? "Admin" : "Teacher"}
                </Typography>
              </Box>
              {!isEditing && (
                <Button
                  variant="contained"
                  startIcon={<Edit />}
                  onClick={() => setIsEditing(true)}
                  sx={{
                    backgroundColor: "grey.400",
                    color: "black",
                  }}
                >
                  Edit Profile
                </Button>
              )}
            </Box>

            <Stack spacing={3}>
              <TextField
                fullWidth
                size="small"
                label="School Name"
                value={profile.school_name}
                onChange={(e) =>
                  setProfile({ ...profile, school_name: e.target.value })
                }
                disabled={!isEditing}
              />
            </Stack>

            {isEditing && (
              <Box
                sx={{
                  mt: 3,
                  display: "flex",
                  gap: 2,
                  justifyContent: "flex-end",
                }}
              >
                <Button
                  variant="text"
                  color="inherit"
                  onClick={() => setIsEditing(false)}
                >
                  Cancel
                </Button>
                <Button
                  variant="contained"
                  onClick={handleSave}
                  sx={{
                    backgroundColor: "grey.400",
                    color: "black",
                  }}
                >
                  Save Changes
                </Button>
              </Box>
            )}
          </Card>
        </Box>
      </Box>
    </Layout>
  );
};
