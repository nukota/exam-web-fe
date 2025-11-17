import React from "react";
import { Box, Typography, IconButton, Button } from "@mui/material";
import {
  MoreVert,
  Timer,
  CalendarToday,
  PlayArrow,
  Pause,
} from "@mui/icons-material";
import { Card } from "../../common";
import type { Exam } from "../../../shared/dtos/exam.dto";

interface ExamItemProps {
  exam: Exam;
  onStart: (examId: string, examType: string) => void;
  onMenuClick?: (event: React.MouseEvent<HTMLElement>, exam: Exam) => void;
  disabled?: boolean;
}

const ExamItem: React.FC<ExamItemProps> = ({
  exam,
  onStart,
  onMenuClick,
  disabled = false,
}) => {
  const handleStartExam = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    if (!disabled) {
      onStart(exam.exam_id, exam.type);
    }
  };

  const handleMenuClick = (e: React.MouseEvent<HTMLElement>) => {
    e.stopPropagation();
    if (onMenuClick) {
      onMenuClick(e, exam);
    }
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
          <Typography
            variant="h6"
            sx={{
              fontWeight: 600,
              color: "text.primary",
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
            }}
          >
            {exam.title}
          </Typography>
          <Box
            sx={{ display: "flex", alignItems: "center", gap: 1, mt: 0.5 }}
          >
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
        {onMenuClick && (
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
        )}
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
              {new Date(exam.start_at).toLocaleString()}
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
              {new Date(exam.end_at).toLocaleString()}
            </Typography>
          </Box>
        )}
      </Box>

      {/* Take Exam Button */}
      <Box sx={{ mt: "auto" }}>
        <Button
          variant="contained"
          fullWidth
          onClick={handleStartExam}
          disabled={disabled}
        >
          {disabled ? "Not Available" : "Take Exam"}
        </Button>
      </Box>
    </Card>
  );
};

export default ExamItem;
