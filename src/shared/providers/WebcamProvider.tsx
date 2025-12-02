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
    console.log("WebcamProvider: cleanup useEffect triggered");
    return () => {
      console.log("WebcamProvider: unmounting, cleaning up");
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
      }
    };
  }, []);

  const stopWebcam = useCallback(() => {
    console.log("WebcamProvider: stopWebcam called");
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
      setStream(null);
      setIsWebcamEnabled(false);
      sessionStorage.removeItem("examWebcamEnabled");
      console.log("WebcamProvider: webcam stopped and cleaned up");
    }
  }, []);

  // Auto-stop webcam when navigating away from allowed routes
  useEffect(() => {
    if (!isWebcamAllowedRoute(location.pathname) && isWebcamEnabled) {
      console.log(
        "WebcamProvider: Navigating away from allowed route, stopping webcam"
      );
      stopWebcam();
    }
  }, [location.pathname, isWebcamEnabled, isWebcamAllowedRoute, stopWebcam]);

  const startWebcam = useCallback(async () => {
    console.log("WebcamProvider: startWebcam called");
    try {
      setError(null);

      // Stop any existing stream first
      if (streamRef.current) {
        console.log("WebcamProvider: stopping existing stream");
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
      console.log("WebcamProvider: webcam started successfully");
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
