import {
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Divider,
} from "@mui/material";
import { Trophy, Crown } from "lucide-react";
import { Card } from "../common";

interface LeaderboardEntry {
  rank: number;
  name: string;
  score: number;
  submitted_at: string;
  isCurrentUser?: boolean;
}

interface LeaderboardProps {
  entries: LeaderboardEntry[];
  currentUserRank: number;
  totalParticipants: number;
}

export const Leaderboard = ({
  entries,
  currentUserRank,
  totalParticipants,
}: LeaderboardProps) => {
  return (
    <Card sx={{ p: 3 }}>
      <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 3 }}>
        <Trophy size={28} />
        <Typography variant="h5" fontWeight="bold">
          Leaderboard
        </Typography>
      </Box>

      {/* Stats Row */}
      <Box
        sx={{
          display: "flex",
          gap: 2,
          mb: 3,
          p: 2,
          borderRadius: 2,
          bgcolor: "grey.100",
        }}
      >
        <Box sx={{ flex: 1, textAlign: "center" }}>
          <Typography variant="h5" color="black" fontWeight="bold">
            #{currentUserRank}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Your Rank
          </Typography>
        </Box>
        <Divider orientation="vertical" flexItem />
        <Box sx={{ flex: 1, textAlign: "center" }}>
          <Typography variant="h5" fontWeight="bold">
            {totalParticipants}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Total Students
          </Typography>
        </Box>
      </Box>

      <TableContainer>
        <Table sx={{ "& .MuiTableCell-root": { py: 2 } }}>
          <TableHead>
            <TableRow sx={{ bgcolor: "grey.100" }}>
              <TableCell sx={{ fontWeight: "bold" }}>Rank</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>Name</TableCell>
              <TableCell align="center" sx={{ fontWeight: "bold" }}>
                Score
              </TableCell>
              <TableCell
                align="right"
                sx={{
                  fontWeight: "bold",
                  display: { xs: "none", md: "table-cell" },
                }}
              >
                Submitted At
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {entries.map((entry) => (
              <TableRow
                key={entry.rank}
                sx={{
                  background: entry.isCurrentUser
                    ? "linear-gradient(90deg, rgba(227, 193, 0, 0.08) 0%, rgba(227, 193, 0, 0.02) 100%)"
                    : "inherit",
                  borderLeft: entry.isCurrentUser ? "4px solid" : "none",
                  borderColor: entry.isCurrentUser
                    ? "primary.main"
                    : "transparent",
                  "&:hover": {
                    background: entry.isCurrentUser
                      ? "linear-gradient(90deg, rgba(227, 193, 0, 0.12) 0%, rgba(227, 193, 0, 0.03) 100%)"
                      : "grey.50",
                  },
                }}
              >
                <TableCell>
                  <Typography
                    variant="body2"
                    fontWeight="bold"
                    color={entry.rank <= 3 ? "primary.main" : "text.primary"}
                  >
                    #{entry.rank}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <Typography
                      variant="body2"
                      fontWeight={entry.isCurrentUser ? "bold" : "normal"}
                    >
                      {entry.name}
                    </Typography>
                    {entry.rank === 1 && <Crown size={16} color="#f59e0b" />}
                  </Box>
                </TableCell>
                <TableCell align="center">
                  <Typography
                    variant="body2"
                    fontWeight={entry.isCurrentUser ? "bold" : "medium"}
                  >
                    {entry.score}
                  </Typography>
                </TableCell>
                <TableCell
                  align="right"
                  sx={{ display: { xs: "none", md: "table-cell" } }}
                >
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    fontWeight={entry.isCurrentUser ? "bold" : "normal"}
                  >
                    {new Date(entry.submitted_at).toLocaleString()}
                  </Typography>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Card>
  );
};
