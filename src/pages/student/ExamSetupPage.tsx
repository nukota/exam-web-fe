import { useState, useRef, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  Box,
  Typography,
  Button,
  TextField,
  Alert,
  CircularProgress,
  Container,
  Switch,
  FormControlLabel,
} from "@mui/material";
import { useExam } from "../../services/examsService";
import { useWebcam } from "../../shared/providers/WebcamProvider";

export const StudentExamSetupPage = () => {
  const { examId } = useParams<{ examId: string }>();
  const navigate = useNavigate();
  const videoRef = useRef<HTMLVideoElement>(null);

  const [webcamEnabled, setWebcamEnabled] = useState<boolean | null>(null);
  const [noWebcamReason, setNoWebcamReason] = useState("");

  const { data: exam, isLoading } = useExam(examId || "");
  const {
    stream,
    isRecording,
    error,
    startWebcam,
    stopWebcam,
    startRecording,
  } = useWebcam();

  // Update video element when stream changes
  useEffect(() => {
    if (videoRef.current && stream) {
      videoRef.current.srcObject = stream;
    } else if (videoRef.current && !stream) {
      videoRef.current.srcObject = null;
    }
  }, [stream]);

  const handleWebcamChoice = async (enabled: boolean) => {
    setWebcamEnabled(enabled);
    setNoWebcamReason("");

    if (enabled) {
      await startWebcam();
    } else {
      // Stop webcam if it was already running
      stopWebcam();
    }
  };

  const handleTakeExam = () => {
    if (!examId || !exam) return;

    // Start recording if webcam is enabled
    if (webcamEnabled && stream && !isRecording) {
      startRecording();
    }

    // Navigate to appropriate exam page
    if (exam.type === "coding") {
      navigate(`/student/exam/coding/${examId}`);
    } else {
      navigate(`/student/exam/${examId}`);
    }
  };

  const canProceed = () => {
    if (webcamEnabled === null) return false;
    if (webcamEnabled) {
      return stream !== null;
    }
    return noWebcamReason.trim().length > 0;
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
            <Box sx={{ display: "flex", alignItems: "center", gap: 2, my: 2 }}>
              <Typography variant="body1" fontWeight={500}>
                Enable Webcam
              </Typography>
              <FormControlLabel
                control={
                  <Switch
                    checked={webcamEnabled || false}
                    onChange={(e) => handleWebcamChoice(e.target.checked)}
                    color="primary"
                  />
                }
                label=""
              />
            </Box>

            {/* Webcam Preview */}
            {webcamEnabled && (
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
                      {isRecording && (
                        <Box
                          sx={{
                            position: "absolute",
                            top: 10,
                            right: 10,
                            bgcolor: "error.main",
                            color: "white",
                            px: 1.5,
                            py: 0.5,
                            borderRadius: 1,
                            display: "flex",
                            alignItems: "center",
                            gap: 0.5,
                          }}
                        >
                          <Box
                            sx={{
                              width: 8,
                              height: 8,
                              borderRadius: "50%",
                              bgcolor: "white",
                              animation: "pulse 1.5s infinite",
                            }}
                          />
                          <Typography variant="caption" fontWeight="bold">
                            RECORDING
                          </Typography>
                        </Box>
                      )}
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
                    ✓ Webcam is working correctly. Recording will begin when you
                    start the exam.
                  </Typography>
                )}
              </Box>
            )}

            {/* No Webcam Reason */}
            {webcamEnabled === false && (
              <Box sx={{ height: 330, width: { xs: 400, lg: 540 } }}>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ mb: 2 }}
                >
                  You may report the reason why you cannot use a webcam for this
                  exam.
                </Typography>
                <TextField
                  fullWidth
                  multiline
                  rows={2}
                  label="Reason for not using webcam"
                  placeholder="Please explain why you cannot use a webcam..."
                  value={noWebcamReason}
                  onChange={(e) => setNoWebcamReason(e.target.value)}
                />
              </Box>
            )}

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
