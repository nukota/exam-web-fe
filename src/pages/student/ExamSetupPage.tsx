import { useState, useRef, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  Box,
  Typography,
  Button,
  RadioGroup,
  FormControlLabel,
  Radio,
  TextField,
  Alert,
  CircularProgress,
  Paper,
} from "@mui/material";
import { Camera, CameraOff } from "lucide-react";
import { useExam } from "../../services/examsService";
import { useWebcam } from "../../shared/providers/WebcamProvider";

export const StudentExamSetupPage = () => {
  const { examId } = useParams<{ examId: string }>();
  const navigate = useNavigate();
  const videoRef = useRef<HTMLVideoElement>(null);

  const [webcamEnabled, setWebcamEnabled] = useState<"yes" | "no" | null>(null);
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

  const handleWebcamChoice = async (value: "yes" | "no") => {
    setWebcamEnabled(value);
    setNoWebcamReason("");

    if (value === "yes") {
      await startWebcam();
    } else {
      // Stop webcam if it was already running
      stopWebcam();
    }
  };

  const handleTakeExam = () => {
    if (!examId || !exam) return;

    // Start recording if webcam is enabled
    if (webcamEnabled === "yes" && stream && !isRecording) {
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
    if (webcamEnabled === "yes") {
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
        bgcolor: "background.default",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        p: 3,
      }}
    >
      <Box sx={{ maxWidth: 800, width: "100%" }}>
        <Paper elevation={3} sx={{ p: 4 }}>
          <Typography variant="h4" fontWeight="bold" gutterBottom>
            Exam Setup
          </Typography>
          <Typography variant="h6" color="text.secondary" gutterBottom>
            {exam.title}
          </Typography>

          <Box sx={{ mt: 4 }}>
            <Typography variant="h6" gutterBottom>
              Webcam Setup
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              For exam integrity, we recommend enabling your webcam during the
              exam.
            </Typography>

            <RadioGroup
              value={webcamEnabled || ""}
              onChange={(e) =>
                handleWebcamChoice(e.target.value as "yes" | "no")
              }
            >
              <FormControlLabel
                value="yes"
                control={<Radio />}
                label={
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <Camera size={20} />
                    <Typography>Enable webcam</Typography>
                  </Box>
                }
              />
              <FormControlLabel
                value="no"
                control={<Radio />}
                label={
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <CameraOff size={20} />
                    <Typography>No webcam available</Typography>
                  </Box>
                }
              />
            </RadioGroup>

            {/* Webcam Preview */}
            {webcamEnabled === "yes" && (
              <Box sx={{ mt: 3 }}>
                <Typography variant="subtitle2" gutterBottom>
                  Webcam Preview
                </Typography>
                <Box
                  sx={{
                    position: "relative",
                    borderRadius: 2,
                    overflow: "hidden",
                    bgcolor: "black",
                    width: "100%",
                    maxWidth: 640,
                    aspectRatio: "4/3",
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
                  <Alert severity="success" sx={{ mt: 2 }}>
                    Webcam is working correctly. Recording will begin when you
                    start the exam.
                  </Alert>
                )}
              </Box>
            )}

            {/* No Webcam Reason */}
            {webcamEnabled === "no" && (
              <Box sx={{ mt: 3 }}>
                <TextField
                  fullWidth
                  multiline
                  rows={3}
                  label="Reason for not using webcam"
                  placeholder="Please explain why you cannot use a webcam..."
                  value={noWebcamReason}
                  onChange={(e) => setNoWebcamReason(e.target.value)}
                  helperText="This information helps us maintain exam integrity"
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

          {/* Action Buttons */}
          <Box
            sx={{
              mt: 4,
              display: "flex",
              justifyContent: "space-between",
              gap: 2,
            }}
          >
            <Button
              variant="outlined"
              onClick={() => navigate("/student/exams")}
              size="large"
            >
              Cancel
            </Button>
            <Button
              variant="contained"
              onClick={handleTakeExam}
              disabled={!canProceed()}
              size="large"
              sx={{ minWidth: 150 }}
            >
              Take Exam
            </Button>
          </Box>
        </Paper>

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
