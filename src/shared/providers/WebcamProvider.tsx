import {
  createContext,
  useContext,
  useRef,
  useState,
  useCallback,
  useEffect,
} from "react";
import type { ReactNode } from "react";
import { useLocation } from "react-router-dom";

interface WebcamContextType {
  stream: MediaStream | null;
  error: string | null;
  isWebcamEnabled: boolean;
  startWebcam: () => Promise<void>;
  stopWebcam: () => void;
}

const WebcamContext = createContext<WebcamContextType | undefined>(undefined);

export const useWebcam = () => {
  const context = useContext(WebcamContext);
  if (!context) {
    throw new Error("useWebcam must be used within WebcamProvider");
  }
  return context;
};

interface WebcamProviderProps {
  children: ReactNode;
}

export const WebcamProvider = ({ children }: WebcamProviderProps) => {
  const streamRef = useRef<MediaStream | null>(null);
  const location = useLocation();

  const [stream, setStream] = useState<MediaStream | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isWebcamEnabled, setIsWebcamEnabled] = useState(false);

  // Check if current route allows webcam usage
  const isWebcamAllowedRoute = useCallback((pathname: string) => {
    // Allowed routes for webcam usage:
    // - /student/exam/:examId/setup (exam setup page)
    // - /student/exam/:examId (standard exam page)
    // - /student/exam/coding/:examId (coding exam page)
    // - /student/exam/coding/:examId/compiler/:questionId (code compiler page)
    const allowedPatterns = [
      /^\/student\/exam\/[^\/]+\/setup$/, // /student/exam/:examId/setup
      /^\/student\/exam\/[^\/]+$/, // /student/exam/:examId
      /^\/student\/exam\/coding\/[^\/]+$/, // /student/exam/coding/:examId
      /^\/student\/exam\/coding\/[^\/]+\/compiler\/[^\/]+$/, // /student/exam/coding/:examId/compiler/:questionId
    ];

    return allowedPatterns.some((pattern) => pattern.test(pathname));
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
        streamRef.current = null;
      }
    };
  }, []);

  const stopWebcam = useCallback(() => {
    console.log("Stopping webcam, streamRef:", !!streamRef.current);
    // Stop tracks from streamRef
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => {
        console.log("Stopping track:", track.kind, track.readyState);
        track.stop();
      });
      streamRef.current = null;
    }
    // Always reset state to ensure UI is in sync
    setStream((currentStream) => {
      // Also stop tracks from state if different from ref (edge case)
      if (currentStream) {
        currentStream.getTracks().forEach((track) => {
          if (track.readyState === "live") {
            track.stop();
          }
        });
      }
      return null;
    });
    setIsWebcamEnabled(false);
    sessionStorage.removeItem("examWebcamEnabled");
    console.log("Webcam stopped successfully");
  }, []);

  // Auto-stop webcam when navigating away from allowed routes
  useEffect(() => {
    console.log("Route changed to:", location.pathname);
    console.log("Is allowed route:", isWebcamAllowedRoute(location.pathname));
    console.log(
      "Stream exists:",
      !!streamRef.current,
      "isWebcamEnabled:",
      isWebcamEnabled
    );

    if (
      !isWebcamAllowedRoute(location.pathname) &&
      (streamRef.current || isWebcamEnabled)
    ) {
      console.log("Auto-stopping webcam due to route change");
      stopWebcam();
    }
  }, [location.pathname, isWebcamAllowedRoute, stopWebcam, isWebcamEnabled]);

  const startWebcam = useCallback(async () => {
    try {
      setError(null);

      // Stop any existing stream first
      if (streamRef.current) {
        stopWebcam();
      }

      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: { width: 640, height: 480 },
        audio: false,
      });

      streamRef.current = mediaStream;
      setStream(mediaStream);
      setIsWebcamEnabled(true);
      sessionStorage.setItem("examWebcamEnabled", "true");
    } catch (err: any) {
      console.error("Error accessing webcam:", err);
      setError(
        "Failed to access webcam. Please check your permissions and try again."
      );
      setIsWebcamEnabled(false);
    }
  }, [stopWebcam]);

  const value: WebcamContextType = {
    stream,
    error,
    isWebcamEnabled,
    startWebcam,
    stopWebcam,
  };

  return (
    <WebcamContext.Provider value={value}>{children}</WebcamContext.Provider>
  );
};
