import {
  createContext,
  useContext,
  useRef,
  useState,
  useCallback,
  useEffect,
} from "react";
import type { ReactNode } from "react";

interface WebcamContextType {
  stream: MediaStream | null;
  isRecording: boolean;
  error: string | null;
  isWebcamEnabled: boolean;
  startWebcam: () => Promise<void>;
  stopWebcam: () => void;
  startRecording: () => void;
  stopRecording: () => void;
  getRecordedChunks: () => Blob[];
  clearRecordedChunks: () => void;
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
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const recordedChunksRef = useRef<Blob[]>([]);

  const [stream, setStream] = useState<MediaStream | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isWebcamEnabled, setIsWebcamEnabled] = useState(false);

  // Cleanup on unmount
  useEffect(() => {
    console.log("WebcamProvider: cleanup useEffect triggered");
    return () => {
      console.log("WebcamProvider: unmounting, cleaning up");
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
      }
      if (mediaRecorderRef.current && isRecording) {
        mediaRecorderRef.current.stop();
      }
    };
  }, [isRecording]);

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

  const startRecording = useCallback(() => {
    console.log("WebcamProvider: startRecording called");
    if (!streamRef.current) {
      console.error("WebcamProvider: No webcam stream available to record");
      setError("No webcam stream available to record");
      return;
    }

    try {
      const mediaRecorder = new MediaRecorder(streamRef.current, {
        mimeType: "video/webm;codecs=vp9",
      });

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          recordedChunksRef.current.push(event.data);
          console.log(
            "WebcamProvider: recorded chunk added, size:",
            event.data.size
          );
        }
      };

      mediaRecorder.onstart = () => {
        console.log("WebcamProvider: recording started");
        setIsRecording(true);
      };

      mediaRecorder.onstop = () => {
        console.log("WebcamProvider: recording stopped");
        setIsRecording(false);
      };

      mediaRecorderRef.current = mediaRecorder;
      mediaRecorder.start(1000); // Collect data every second
      console.log("WebcamProvider: MediaRecorder started");
    } catch (err) {
      console.error("Error starting recording:", err);
      setError("Failed to start recording. Please try again.");
    }
  }, []);

  const stopRecording = useCallback(() => {
    console.log("WebcamProvider: stopRecording called");
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      console.log("WebcamProvider: MediaRecorder stopped");
    } else {
      console.log("WebcamProvider: No active recording to stop");
    }
  }, [isRecording]);

  const getRecordedChunks = useCallback(() => {
    console.log(
      "WebcamProvider: getRecordedChunks called, chunks count:",
      recordedChunksRef.current.length
    );
    return [...recordedChunksRef.current];
  }, []);

  const clearRecordedChunks = useCallback(() => {
    console.log(
      "WebcamProvider: clearRecordedChunks called, clearing",
      recordedChunksRef.current.length,
      "chunks"
    );
    recordedChunksRef.current = [];
  }, []);

  const value: WebcamContextType = {
    stream,
    isRecording,
    error,
    isWebcamEnabled,
    startWebcam,
    stopWebcam,
    startRecording,
    stopRecording,
    getRecordedChunks,
    clearRecordedChunks,
  };

  return (
    <WebcamContext.Provider value={value}>{children}</WebcamContext.Provider>
  );
};
