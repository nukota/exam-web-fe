import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Box, Typography, Button, Container } from "@mui/material";
import { Google as GoogleIcon } from "@mui/icons-material";
import { signInWithPopup } from "firebase/auth";
import { auth, googleProvider } from "../shared/lib/firebase";
import { useSyncUser, useCurrentUser } from "../services/authService";

export const SignInPage = () => {
  const navigate = useNavigate();
  const syncUser = useSyncUser();
  const { data: currentUser } = useCurrentUser();

  useEffect(() => {
    if (currentUser) {
      // Redirect based on user role
      if (currentUser.role === "admin" || currentUser.role === "teacher") {
        navigate("/admin/dashboard");
      } else {
        navigate("/student/exams");
      }
    }
  }, [currentUser, navigate]);

  const handleSignIn = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
      await syncUser.mutateAsync();
    } catch (error) {
      console.error("Sign in failed:", error);
    }
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#eee",
      }}
    >
      <style>
        {`
          .loop-container {
            overflow: hidden;
            height: 80px;
            width: 100%;
          }

          .loop-text {
            display: inline-block;
            white-space: nowrap;
            animation: slide 3s ease-in-out infinite;
          }

          @keyframes slide {
            0% {
              transform: translateX(-20px);
              opacity: 0;
            }
            25% {
              transform: translateX(0);
              opacity: 1;
            }
            75% {
              transform: translateX(0);
              opacity: 1;
            }
            100% {
              transform: translateX(20px);
              opacity: 0;
            }
          }
        `}
      </style>
      <Container
        sx={{ background: "white", borderRadius: 4, width: "fit-content" }}
      >
        <Box
          sx={{
            p: 4,
            borderRadius: 2,
            textAlign: "center",
          }}
        >
          <div className="loop-container">
            <Typography
              gutterBottom
              fontWeight="bold"
              color="black"
              className="loop-text"
              sx={{
                px: 2,
                fontFamily: "REM",
                letterSpacing: 4,
                fontSize: "3.5rem",
                fontWeight: "500",
              }}
            >
              ExamWeb
            </Typography>
          </div>
          <Typography
            variant="body1"
            color="text.secondary"
            gutterBottom
            sx={{ mb: 3 }}
          >
            Your ultimate platform for online exams
          </Typography>
          <Button
            variant="contained"
            size="large"
            startIcon={<GoogleIcon />}
            onClick={handleSignIn}
            sx={{
              fontWeight: "bold",
              my: 2,
            }}
          >
            Sign in with Google
          </Button>
        </Box>
      </Container>
    </Box>
  );
};
