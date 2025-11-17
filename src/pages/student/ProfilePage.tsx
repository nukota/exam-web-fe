import { useState } from "react";
import {
  Box,
  Typography,
  Paper,
  TextField,
  Button,
  Avatar,
  IconButton,
  Stack,
} from "@mui/material";
import { Edit, PhotoCamera } from "@mui/icons-material";
import { Layout } from "../../components/common";
import { useAuth } from "../../shared/providers/AuthProvider";

export const StudentProfilePage = () => {
  const { currentUser } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [profile, setProfile] = useState({
    full_name: currentUser?.full_name || "",
    email: currentUser?.email || "",
    dob: currentUser?.dob || "",
    class_name: currentUser?.class_name || "",
    school_name: currentUser?.school_name || "",
  });

  const handleSave = () => {
    // In a real app, save to backend
    console.log("Saving profile:", profile);
    setIsEditing(false);
  };

  return (
    <Layout>
      <Box>
        <Typography variant="h4" component="h1" fontWeight="bold" gutterBottom>
          My Profile
        </Typography>

        <Paper elevation={2} sx={{ p: 4, mt: 3 }}>
          <Box sx={{ display: "flex", alignItems: "center", mb: 4 }}>
            <Box sx={{ position: "relative" }}>
              <Avatar
                sx={{
                  width: 120,
                  height: 120,
                  fontSize: "3rem",
                  bgcolor: "primary.main",
                }}
              >
                {profile.full_name?.charAt(0) ||
                  currentUser?.username?.charAt(0)}
              </Avatar>
              {isEditing && (
                <IconButton
                  sx={{
                    position: "absolute",
                    bottom: 0,
                    right: 0,
                    bgcolor: "background.paper",
                  }}
                >
                  <PhotoCamera />
                </IconButton>
              )}
            </Box>
            <Box sx={{ ml: 3, flex: 1 }}>
              <Typography variant="h5" fontWeight="bold">
                {profile.full_name || currentUser?.username}
              </Typography>
              <Typography variant="body1" color="text.secondary">
                {currentUser?.email}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Role: Student
              </Typography>
            </Box>
            {!isEditing && (
              <Button
                variant="outlined"
                startIcon={<Edit />}
                onClick={() => setIsEditing(true)}
              >
                Edit Profile
              </Button>
            )}
          </Box>

          <Stack spacing={3}>
            <Box sx={{ display: "flex", gap: 2 }}>
              <TextField
                fullWidth
                label="Full Name"
                value={profile.full_name}
                onChange={(e) =>
                  setProfile({ ...profile, full_name: e.target.value })
                }
                disabled={!isEditing}
              />
              <TextField
                fullWidth
                label="Email"
                value={profile.email}
                onChange={(e) =>
                  setProfile({ ...profile, email: e.target.value })
                }
                disabled={!isEditing}
              />
            </Box>
            <Box sx={{ display: "flex", gap: 2 }}>
              <TextField
                fullWidth
                label="Date of Birth"
                type="date"
                value={profile.dob}
                onChange={(e) =>
                  setProfile({ ...profile, dob: e.target.value })
                }
                disabled={!isEditing}
                InputLabelProps={{ shrink: true }}
              />
              <TextField
                fullWidth
                label="Class"
                value={profile.class_name}
                onChange={(e) =>
                  setProfile({ ...profile, class_name: e.target.value })
                }
                disabled={!isEditing}
              />
            </Box>
            <TextField
              fullWidth
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
              <Button variant="outlined" onClick={() => setIsEditing(false)}>
                Cancel
              </Button>
              <Button variant="contained" onClick={handleSave}>
                Save Changes
              </Button>
            </Box>
          )}
        </Paper>
      </Box>
    </Layout>
  );
};
