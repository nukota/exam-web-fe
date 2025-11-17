import React from "react";
import { Box, Typography } from "@mui/material";
import Card from "../../common/Card";
import Chip from "../../common/Chip";

interface StatCardProps {
  title: string;
  value: string | number;
  icon: React.ReactElement;
  change?: string;
  onClick?: () => void;
}

const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  icon,
  change,
  onClick,
}) => {
  return (
    <Card onClick={onClick}>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <Typography variant="body1" color="text.secondary">
          {title}
        </Typography>
        {change && (
          <Chip
            label={change}
            size="small"
            color={change.startsWith("+") ? "success" : "error"}
          />
        )}
      </Box>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 2,
          my: 1,
        }}
      >
        <Box
          sx={{ height: 28, width: 28, display: "flex", alignItems: "center" }}
        >
          {icon}
        </Box>
        <Typography
          variant="h5"
          sx={{ fontWeight: "bold", color: "text.primary" }}
        >
          {value}
        </Typography>
      </Box>
    </Card>
  );
};

export default StatCard;