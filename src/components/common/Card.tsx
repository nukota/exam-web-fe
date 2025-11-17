import React from "react";
import { Box } from "@mui/material";
import type { BoxProps } from "@mui/material";

interface CustomCardProps extends BoxProps {
  onClick?: () => void;
  children: React.ReactNode;
  variant?: "default" | "uniform"; // Add variant for uniform sizing
}

const Card: React.FC<CustomCardProps> = ({
  onClick,
  children,
  sx,
  variant = "default",
  ...props
}) => {
  return (
    <Box
      sx={{
        border: "1px solid #e0e0e0",
        backgroundColor: "white",
        p: 2,
        borderRadius: 2,
        cursor: onClick ? "pointer" : "default",
        transition: "all 0.2s ease-in-out",
        ...(variant === "uniform" && {
          minHeight: 240,
          display: "flex",
          flexDirection: "column",
        }),
        ...(onClick && {
          "&:hover": {
            transform: "translateY(-6px)",
            boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
          },
        }),
        ...sx,
      }}
      onClick={onClick}
      {...props}
    >
      {children}
    </Box>
  );
};

export default Card;
