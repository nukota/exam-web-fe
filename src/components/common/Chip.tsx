import React from "react";
import { Chip as MuiChip } from "@mui/material";
import type { ChipProps as MuiChipProps } from "@mui/material";
import { alpha } from "@mui/material/styles";

interface ChipProps extends Omit<MuiChipProps, "color"> {
  color?: string;
}

const Chip: React.FC<ChipProps> = ({ color = "#2196f3", sx, ...props }) => {
  return (
    <MuiChip
      variant="outlined"
      size="medium"
      sx={{
        borderColor: alpha(color, 0.6),
        backgroundColor: "white",
        color: color,
        fontWeight: 700,
        boxShadow: `0px 2px 8px ${alpha(color, 0.05)}`,
        "&:hover": {
          backgroundColor: alpha(color, 0.06),
          boxShadow: `0px 4px 12px ${alpha(color, 0.05)}`,
        },
        ...sx,
      }}
      {...props}
    />
  );
};

export default Chip;
