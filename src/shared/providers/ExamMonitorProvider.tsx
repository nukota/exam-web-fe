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
      console.log("ExamMonitor: Fullscreen requested");
    } catch (error) {
      console.error("ExamMonitor: Failed to enter fullscreen:", error);
    }
  }, []);

  // Reset monitoring counters and enable monitoring
  const resetMonitoring = useCallback(() => {
    setTabSwitches(0);
    setHasExitedFullscreen(false);
    setHasEnteredFullscreen(false);
    setIsMonitoring(true);
    console.log("ExamMonitor: Monitoring counters reset and enabled");
  }, []);

  // Monitor visibility change (tab switching/minimizing)
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden && isMonitoring) {
        setTabSwitches((prev) => {
          const newCount = prev + 1;
          console.log("ExamMonitor: Tab switch detected, count:", newCount);
          return newCount;
        });
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
      console.log(
        "ExamMonitor: Fullscreen change event, isFullscreen:",
        isCurrentlyFullscreen
      );
      setIsFullscreen(isCurrentlyFullscreen);

      // Track when user enters fullscreen
      if (isCurrentlyFullscreen && isMonitoring) {
        setHasEnteredFullscreen(true);
        console.log("ExamMonitor: Fullscreen mode entered");
      }

      // If user exits fullscreen after having entered it while monitoring, set flag
      if (!isCurrentlyFullscreen && isMonitoring && hasEnteredFullscreen) {
        setHasExitedFullscreen(true);
        console.log("ExamMonitor: Fullscreen exit detected");
      }
    };

    // Check initial fullscreen state
    const initialFullscreen = checkFullscreen();
    setIsFullscreen(initialFullscreen);
    console.log("ExamMonitor: Initial fullscreen state:", initialFullscreen);

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

  // Monitor window focus/blur
  useEffect(() => {
    const handleBlur = () => {
      if (isMonitoring) {
        console.log("ExamMonitor: Window focus lost");
      }
    };

    const handleFocus = () => {
      if (isMonitoring) {
        console.log("ExamMonitor: Window focus regained");
      }
    };

    window.addEventListener("blur", handleBlur);
    window.addEventListener("focus", handleFocus);

    return () => {
      window.removeEventListener("blur", handleBlur);
      window.removeEventListener("focus", handleFocus);
    };
  }, [isMonitoring]);

  // Enable monitoring when on exam pages
  useEffect(() => {
    const pathname = window.location.pathname;
    const isExamPage = /^\/student\/exam\//.test(pathname);
    setIsMonitoring(isExamPage);

    if (isExamPage) {
      console.log("ExamMonitor: Monitoring enabled");
    } else {
      console.log("ExamMonitor: Monitoring disabled");
    }
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
