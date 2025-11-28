import React, { useState } from "react";
import {
  Box,
  Typography,
  IconButton,
  Button,
  Menu,
  MenuItem,
} from "@mui/material";
import {
  Timer,
  CalendarToday,
  PlayArrow,
  Pause,
  MoreVert,
} from "@mui/icons-material";
import { Card } from "../../common";
import type { AllExamsPageItemDTO } from "../../../shared/dtos/exam.dto";

interface ExamItemProps {
  exam: AllExamsPageItemDTO;
  onStart: (examId: string, examType: string) => void;
  onLeave?: (examId: string) => void;
  disabled?: boolean;
}

const ExamItem: React.FC<ExamItemProps> = ({
  exam,
  onStart,
  onLeave = () => {},
  disabled = false,
}) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const handleStartExam = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    if (!disabled && exam.status === "started") {
      onStart(exam.exam_id, exam.type);
    }
  };

  const handleMenuClick = (e: React.MouseEvent<HTMLElement>) => {
    e.stopPropagation();
    setAnchorEl(e.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLeaveExam = () => {
    if (onLeave) {
      onLeave(exam.exam_id);
    }
    handleMenuClose();
  };

  return (
    <Card
      sx={{
        pl: 3,
        minHeight: 200,
        display: "flex",
        flexDirection: "column",
        transition: "all 0.2s ease-in-out",
        "&:hover": {
          transform: "translateY(-2px)",
          boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
        },
      }}
    >
      {/* Card Header */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          mb: 2,
        }}
      >
        <Box sx={{ minWidth: 0, flex: 1 }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 0.5 }}>
            <Typography
              variant="h6"
              sx={{
                fontWeight: 600,
                color: "text.primary",
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
                flex: 1,
                minWidth: 0,
                textAlign: "left",
              }}
            >
              {exam.title}
            </Typography>
            <Typography
              variant="caption"
              sx={{
                color: "text.secondary",
                bgcolor: "grey.100",
                px: 1,
                py: 0.25,
                borderRadius: 1,
                fontWeight: 500,
                flexShrink: 0,
              }}
            >
              {exam.type === "coding" ? "Coding" : "Standard"}
            </Typography>
          </Box>
        </Box>
        <IconButton
          onClick={handleMenuClick}
          size="small"
          sx={{
            color: "text.secondary",
            "&:hover": { color: "text.primary" },
          }}
        >
          <MoreVert />
        </IconButton>
      </Box>

      {/* Exam Details */}
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          gap: 1.5,
          mb: 2,
          flex: 1,
        }}
      >
        {exam.description && (
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{
              overflow: "hidden",
              textOverflow: "ellipsis",
              display: "-webkit-box",
              WebkitLineClamp: 2,
              WebkitBoxOrient: "vertical",
            }}
          >
            {exam.description}
          </Typography>
        )}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            color: "text.secondary",
            minWidth: 0,
          }}
        >
          <Timer sx={{ fontSize: 20, mr: 1, flexShrink: 0 }} />
          <Typography
            variant="body2"
            sx={{
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
            }}
          >
            {exam.duration_minutes} minutes
          </Typography>
        </Box>
        {exam.start_at && (
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              color: "text.secondary",
              minWidth: 0,
            }}
          >
            <PlayArrow sx={{ fontSize: 20, mr: 1, flexShrink: 0 }} />
            <Typography
              variant="body2"
              sx={{
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
              }}
            >
              {(() => {
                if (!exam.start_at) return "N/A";
                const date = new Date(exam.start_at);
                return date.toLocaleString("en-US", {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                  hour: "numeric",
                  minute: "2-digit",
                  hour12: true,
                });
              })()}
            </Typography>
          </Box>
        )}
        {exam.end_at && (
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              color: "text.secondary",
              minWidth: 0,
            }}
          >
            {exam.start_at ? (
              <Pause sx={{ fontSize: 20, mr: 1, flexShrink: 0 }} />
            ) : (
              <CalendarToday sx={{ fontSize: 20, mr: 1, flexShrink: 0 }} />
            )}
            <Typography
              variant="body2"
              sx={{
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
              }}
            >
              {(() => {
                if (!exam.end_at) return "N/A";
                const date = new Date(exam.end_at);
                return date.toLocaleString("en-US", {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                  hour: "numeric",
                  minute: "2-digit",
                  hour12: true,
                });
              })()}
            </Typography>
          </Box>
        )}
      </Box>

      {/* Take Exam Button */}
      <Box sx={{ mt: "auto" }}>
        <Button
          variant="contained"
          size="small"
          fullWidth
          onClick={handleStartExam}
          disabled={disabled || exam.status !== "started"}
        >
          {exam.status === "started" ? "Take Exam" : exam.status}
        </Button>
      </Box>

      {/* Menu */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
      >
        <MenuItem onClick={handleLeaveExam}>Leave</MenuItem>
      </Menu>
    </Card>
  );
};

export default ExamItem;
