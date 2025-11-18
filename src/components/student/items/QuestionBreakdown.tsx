import { Box, Typography } from "@mui/material";

interface QuestionResult {
  question: string;
  earned: number;
  max: number;
  correct: boolean;
}

interface QuestionBreakdownProps {
  results: QuestionResult[];
}

export const QuestionBreakdown = ({ results }: QuestionBreakdownProps) => {
  return (
    <Box
      sx={{
        display: "grid",
        gridTemplateColumns: {
          xs: "1fr",
          md: "1fr 1fr",
          lg: "1fr 1fr 1fr",
        },
        gap: 2,
      }}
    >
      {results.map((result, index) => (
        <Box
          key={index}
          sx={{
            p: 2,
            borderRadius: 3,
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            height: 100,
            position: "relative",
            overflow: "hidden",
            bgcolor: result.correct
              ? "rgba(255, 235, 59, 0.1)"
              : "rgba(158, 158, 158, 0.1)",
            "&:hover": {
              bgcolor: result.correct
                ? "rgba(255, 235, 59, 0.2)"
                : "rgba(158, 158, 158, 0.2)",
            },
            transition: "all 0.2s ease-in-out",
          }}
        >
          <Typography
            variant="body2"
            color="text.primary"
            sx={{
              display: "-webkit-box",
              WebkitLineClamp: 2,
              WebkitBoxOrient: "vertical",
              overflow: "hidden",
              textOverflow: "ellipsis",
              lineHeight: 1.5,
              textAlign: "left",
              fontSize: "0.9rem",
            }}
          >
            <strong>Q{index + 1}:</strong> {result.question}
          </Typography>
          <Box
            sx={{
              display: "flex",
              justifyContent: "flex-end",
              alignItems: "flex-end",
            }}
          >
            <Typography variant="body2" fontWeight="bold">
              {result.earned} / {result.max}
            </Typography>
          </Box>
        </Box>
      ))}
    </Box>
  );
};
