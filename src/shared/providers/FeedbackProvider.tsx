import React, { createContext, useContext, useState } from "react";
import type { ReactNode } from "react";
import {
  Snackbar,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
} from "@mui/material";

interface AlertDialogConfig {
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  severity?: "warning" | "error" | "info";
  onConfirm?: () => void;
  onCancel?: () => void;
}

interface SnackbarConfig {
  message: string;
  severity?: "success" | "error" | "warning" | "info";
  duration?: number;
}

interface FeedbackContextType {
  showSnackbar: (config: SnackbarConfig) => void;
  showAlert: (config: AlertDialogConfig) => void;
  hideAlert: () => void;
}

const FeedbackContext = createContext<FeedbackContextType | undefined>(
  undefined
);

interface FeedbackProviderProps {
  children: ReactNode;
}

export const FeedbackProvider: React.FC<FeedbackProviderProps> = ({
  children,
}) => {
  // Snackbar state
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState<
    "success" | "error" | "warning" | "info"
  >("info");
  const [snackbarDuration, setSnackbarDuration] = useState(4000);

  // Alert dialog state
  const [alertOpen, setAlertOpen] = useState(false);
  const [alertConfig, setAlertConfig] = useState<AlertDialogConfig | null>(
    null
  );

  const showSnackbar = ({
    message,
    severity = "info",
    duration = 4000,
  }: SnackbarConfig) => {
    setSnackbarMessage(message);
    setSnackbarSeverity(severity);
    setSnackbarDuration(duration);
    setSnackbarOpen(true);
  };

  const showAlert = (config: AlertDialogConfig) => {
    setAlertConfig(config);
    setAlertOpen(true);
  };

  const hideAlert = () => {
    setAlertOpen(false);
    setAlertConfig(null);
  };

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  const handleAlertConfirm = () => {
    if (alertConfig?.onConfirm) {
      alertConfig.onConfirm();
    }
    hideAlert();
  };

  const handleAlertCancel = () => {
    if (alertConfig?.onCancel) {
      alertConfig.onCancel();
    }
    hideAlert();
  };

  const getSeverityColor = (
    severity: "warning" | "error" | "info" | undefined
  ) => {
    switch (severity) {
      case "error":
        return "error";
      case "warning":
        return "warning";
      case "info":
      default:
        return "primary";
    }
  };

  const value: FeedbackContextType = {
    showSnackbar,
    showAlert,
    hideAlert,
  };

  return (
    <FeedbackContext.Provider value={value}>
      {children}

      {/* Global Snackbar */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={snackbarDuration}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
      >
        <Alert
          onClose={handleSnackbarClose}
          severity={snackbarSeverity}
          variant="filled"
          sx={{ width: "100%" }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>

      {/* Global Alert Dialog */}
      <Dialog
        open={alertOpen}
        onClose={handleAlertCancel}
        maxWidth="xs"
        fullWidth
      >
        <DialogTitle
          sx={{
            color: "text.primary",
            fontWeight: 600,
            borderColor: `${getSeverityColor(alertConfig?.severity)}.main`,
            pb: 2,
          }}
        >
          {alertConfig?.title}
        </DialogTitle>
        <DialogContent sx={{ pt: 3 }}>
          <Typography variant="body1" sx={{ mb: 0 }}>
            {alertConfig?.message}
          </Typography>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={handleAlertCancel} color="inherit" size="small">
            {alertConfig?.cancelText || "Cancel"}
          </Button>
          {alertConfig?.onConfirm && (
            <Button
              onClick={handleAlertConfirm}
              variant="contained"
              size="small"
              color={getSeverityColor(alertConfig?.severity)}
              sx={{ fontWeight: 600 }}
              disableElevation
            >
              {alertConfig?.confirmText || "Confirm"}
            </Button>
          )}
        </DialogActions>
      </Dialog>
    </FeedbackContext.Provider>
  );
};

export const useFeedback = (): FeedbackContextType => {
  const context = useContext(FeedbackContext);
  if (context === undefined) {
    throw new Error("useFeedback must be used within a FeedbackProvider");
  }
  return context;
};
