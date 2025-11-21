import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";
import type { ReactNode } from "react";

interface ExamTimerContextType {
  timeRemaining: number;
  isRunning: boolean;
  startTimer: (durationInSeconds: number, onTimeout?: () => void) => void;
  stopTimer: () => void;
  resetTimer: () => void;
  formatTime: (seconds: number) => string;
}

const ExamTimerContext = createContext<ExamTimerContextType | undefined>(
  undefined
);

export const useExamTimer = () => {
  const context = useContext(ExamTimerContext);
  if (!context) {
    throw new Error("useExamTimer must be used within an ExamTimerProvider");
  }
  return context;
};

interface ExamTimerProviderProps {
  children: ReactNode;
}

export const ExamTimerProvider: React.FC<ExamTimerProviderProps> = ({
  children,
}) => {
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [onTimeoutCallback, setOnTimeoutCallback] = useState<
    (() => void) | undefined
  >();

  const formatTime = useCallback((seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hours.toString().padStart(2, "0")}:${minutes
      .toString()
      .padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  }, []);

  const startTimer = useCallback(
    (durationInSeconds: number, onTimeout?: () => void) => {
      setTimeRemaining(durationInSeconds);
      setIsRunning(true);
      setOnTimeoutCallback(() => onTimeout);
    },
    []
  );

  const stopTimer = useCallback(() => {
    setIsRunning(false);
  }, []);

  const resetTimer = useCallback(() => {
    setTimeRemaining(0);
    setIsRunning(false);
    setOnTimeoutCallback(undefined);
  }, []);

  useEffect(() => {
    if (!isRunning) return;

    const timer = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev <= 1) {
          setIsRunning(false);
          if (onTimeoutCallback) {
            onTimeoutCallback();
          }
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isRunning, onTimeoutCallback]);

  const value: ExamTimerContextType = {
    timeRemaining,
    isRunning,
    startTimer,
    stopTimer,
    resetTimer,
    formatTime,
  };

  return (
    <ExamTimerContext.Provider value={value}>
      {children}
    </ExamTimerContext.Provider>
  );
};
