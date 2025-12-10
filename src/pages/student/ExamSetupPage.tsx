import { useRef, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  Box,
  Typography,
  Button,
  Alert,
  CircularProgress,
  Container,
} from "@mui/material";
import { useExam } from "../../services/examsService";
import { useWebcam } from "../../shared/providers/WebcamProvider";

export const StudentExamSetupPage = () => {
  const { examId } = useParams<{ examId: string }>();
  const navigate = useNavigate();
  const videoRef = useRef<HTMLVideoElement>(null);

  const { data: exam, isLoading } = useExam(examId || "");
  const { stream, error, startWebcam } = useWebcam();

  // Update video element when stream changes
  useEffect(() => {
    if (videoRef.current && stream) {
      videoRef.current.srcObject = stream;
    } else if (videoRef.current && !stream) {
      videoRef.current.srcObject = null;
    }
  }, [stream]);

  // Auto-start webcam on mount
  useEffect(() => {
    startWebcam();
  }, [startWebcam]);

  const handleTakeExam = () => {
    if (!examId || !exam) return;

    // Navigate to appropriate exam page
    if (exam.type === "coding") {
      navigate(`/student/exam/coding/${examId}`);
    } else {
      navigate(`/student/exam/${examId}`);
    }
  };

  const canProceed = () => {
    return stream !== null;
  };

  if (isLoading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "100vh",
          bgcolor: "background.default",
        }}
      >
        <CircularProgress size={60} />
      </Box>
    );
  }

  if (!exam) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "100vh",
          bgcolor: "background.default",
          p: 3,
        }}
      >
        <Alert severity="error">Exam not found</Alert>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#eee",
        py: 4,
      }}
    >
      <Box sx={{ maxWidth: 800, width: "100%" }}>
        <Container
          sx={{
            background: "white",
            borderRadius: 4,
            width: "fit-content",
            py: 2,
            px: 4,
          }}
        >
          <Typography variant="h5" fontWeight={700} gutterBottom>
            Exam Setup
          </Typography>

          {/* Exam Information Section */}
          <Box
            sx={{
              mt: 2,
              p: 2,
              bgcolor: "#f0f0f0",
              borderRadius: 2,
              display: "flex",
              flexDirection: "column",
              alignItems: "flex-start",
              gap: 0.5,
            }}
          >
            <Typography variant="body1">Title: {exam.title}</Typography>
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                width: "100%",
              }}
            >
              <Typography variant="body2" color="text.secondary">
                {exam.type === "coding" ? "Coding Exam" : "Standard Exam"}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {exam.questions?.length || 0} questions in{" "}
                {exam.duration_minutes} minutes
              </Typography>
            </Box>
          </Box>

          <Box sx={{ mt: 2 }}>
            <Typography variant="body1" fontWeight={500} sx={{ mb: 2 }}>
              Webcam Preview
            </Typography>

            {/* Webcam Preview */}
            {
              <Box
                sx={{
                  height: 330,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "flex-start",
                }}
              >
                <Box
                  sx={{
                    position: "relative",
                    borderRadius: 1,
                    overflow: "hidden",
                    bgcolor: "black",
                    width: { xs: 400, lg: 540 },
                    aspectRatio: "16/9",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  {stream ? (
                    <>
                      <video
                        ref={videoRef}
                        autoPlay
                        muted
                        playsInline
                        style={{
                          width: "100%",
                          height: "100%",
                          objectFit: "cover",
                        }}
                      />
                    </>
                  ) : (
                    <Box
                      sx={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        gap: 2,
                        color: "grey.500",
                      }}
                    >
                      <CircularProgress size={40} color="inherit" />
                      <Typography variant="body2" color="inherit">
                        Starting webcam...
                      </Typography>
                    </Box>
                  )}
                </Box>
                {stream && (
                  <Typography
                    variant="body2"
                    color="success.main"
                    sx={{ mt: 1, textAlign: "center", fontWeight: 500 }}
                  >
                    ✓ Webcam is working correctly.
                  </Typography>
                )}
              </Box>
            }

            {/* Error Message */}
            {error && (
              <Alert severity="error" sx={{ mt: 2 }}>
                {error}
              </Alert>
            )}
          </Box>

          {/* Cheat Detection Warning */}
          <Box
            sx={{
              mt: 4,
              p: 1,
              bgcolor: "#f0f0f0",
              borderRadius: 2,
            }}
          >
            <Typography variant="body2" color="#999">
              This exam uses monitoring technologies to ensure fair examination.
              <p> Suspicious activity may result in exam termination.</p>
            </Typography>
          </Box>

          {/* Action Buttons */}
          <Box
            sx={{
              mt: 4,
              display: "flex",
              justifyContent: "flex-end",
              gap: 2,
            }}
          >
            <Button
              variant="text"
              color="inherit"
              onClick={() => navigate("/student/exams")}
            >
              Cancel
            </Button>
            <Button
              variant="contained"
              onClick={handleTakeExam}
              disabled={!canProceed()}
              sx={{ minWidth: 150, fontWeight: 500 }}
            >
              Take Exam
            </Button>
          </Box>
        </Container>

        {/* Keyframe animation for recording indicator */}
        <style>
          {`
            @keyframes pulse {
              0%, 100% { opacity: 1; }
              50% { opacity: 0.3; }
            }
          `}
        </style>
      </Box>
    </Box>
  );
};
