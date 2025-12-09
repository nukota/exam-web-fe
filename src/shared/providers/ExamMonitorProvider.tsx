import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
} from "react";
import type { ReactNode } from "react";

interface ExamMonitorContextType {
  tabSwitches: number;
  hasExitedFullscreen: boolean;
  isFullscreen: boolean;
  requestFullscreen: () => Promise<void>;
  resetMonitoring: () => void;
}

const ExamMonitorContext = createContext<ExamMonitorContextType | undefined>(
  undefined
);

export const useExamMonitor = () => {
  const context = useContext(ExamMonitorContext);
  if (!context) {
    throw new Error("useExamMonitor must be used within ExamMonitorProvider");
  }
  return context;
};

interface ExamMonitorProviderProps {
  children: ReactNode;
}

export const ExamMonitorProvider = ({ children }: ExamMonitorProviderProps) => {
  const [tabSwitches, setTabSwitches] = useState(0);
  const [hasExitedFullscreen, setHasExitedFullscreen] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isMonitoring, setIsMonitoring] = useState(false);
  const [hasEnteredFullscreen, setHasEnteredFullscreen] = useState(false);

  // Check if document is in fullscreen
  const checkFullscreen = useCallback(() => {
    const fullscreenElement =
      document.fullscreenElement ||
      (document as any).webkitFullscreenElement ||
      (document as any).mozFullScreenElement;
    return !!fullscreenElement;
  }, []);

  // Request fullscreen mode
  const requestFullscreen = useCallback(async () => {
    try {
      const elem = document.documentElement;
      if (elem.requestFullscreen) {
        await elem.requestFullscreen();
      } else if ((elem as any).webkitRequestFullscreen) {
        await (elem as any).webkitRequestFullscreen();
      } else if ((elem as any).mozRequestFullScreen) {
        await (elem as any).mozRequestFullScreen();
      } else if ((elem as any).msRequestFullscreen) {
        await (elem as any).msRequestFullscreen();
      }
      // Don't set state here - let the fullscreenchange event handler do it
    } catch (error) {
      // Error handled silently
    }
  }, []);

  // Reset monitoring counters and enable monitoring
  const resetMonitoring = useCallback(() => {
    setTabSwitches(0);
    setHasExitedFullscreen(false);
    setHasEnteredFullscreen(false);
    setIsMonitoring(true);
  }, []);

  // Monitor visibility change (tab switching/minimizing)
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden && isMonitoring) {
        setTabSwitches((prev) => prev + 1);
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [isMonitoring]);

  // Monitor fullscreen changes
  useEffect(() => {
    const handleFullscreenChange = () => {
      const isCurrentlyFullscreen = checkFullscreen();
      setIsFullscreen(isCurrentlyFullscreen);

      // Track when user enters fullscreen
      if (isCurrentlyFullscreen && isMonitoring) {
        setHasEnteredFullscreen(true);
      }

      // If user exits fullscreen after having entered it while monitoring, set flag
      if (!isCurrentlyFullscreen && isMonitoring && hasEnteredFullscreen) {
        setHasExitedFullscreen(true);
      }
    };

    // Check initial fullscreen state
    const initialFullscreen = checkFullscreen();
    setIsFullscreen(initialFullscreen);

    document.addEventListener("fullscreenchange", handleFullscreenChange);
    document.addEventListener("webkitfullscreenchange", handleFullscreenChange);
    document.addEventListener("mozfullscreenchange", handleFullscreenChange);
    document.addEventListener("MSFullscreenChange", handleFullscreenChange);

    return () => {
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
      document.removeEventListener(
        "webkitfullscreenchange",
        handleFullscreenChange
      );
      document.removeEventListener(
        "mozfullscreenchange",
        handleFullscreenChange
      );
      document.removeEventListener(
        "MSFullscreenChange",
        handleFullscreenChange
      );
    };
  }, [isMonitoring, checkFullscreen, hasEnteredFullscreen]);

  // Enable monitoring when on exam pages
  useEffect(() => {
    const pathname = window.location.pathname;
    const isExamPage = /^\/student\/exam\//.test(pathname);
    setIsMonitoring(isExamPage);
  }, []);

  const value: ExamMonitorContextType = {
    tabSwitches,
    hasExitedFullscreen,
    isFullscreen,
    requestFullscreen,
    resetMonitoring,
  };

  return (
    <ExamMonitorContext.Provider value={value}>
      {children}
    </ExamMonitorContext.Provider>
  );
};
