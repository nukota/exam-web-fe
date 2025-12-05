import { useState } from "react";
import { Box, Drawer, useMediaQuery, useTheme } from "@mui/material";
import { Header } from "./Header";
import { NavBar } from "./NavBar";
import type { ReactNode } from "react";
import { useCurrentUser } from "../../services/authService";

interface LayoutProps {
  children: ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { data: currentUser } = useCurrentUser();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const userRole = currentUser?.role === "admin" ? "admin" : "student";

  return (
    <Box sx={{ display: "flex", height: "100vh" }}>
      {/* Permanent drawer for desktop */}
      {!isMobile && (
        <Box
          sx={{
            width: 240,
            flexShrink: 0,
            borderRight: 1,
            borderColor: "divider",
            position: "sticky",
            top: 0,
            height: "100vh",
            overflowY: "auto",
            overflowX: "hidden",
          }}
        >
          <NavBar role={userRole} />
        </Box>
      )}

      {/* Temporary drawer for mobile */}
      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        ModalProps={{ keepMounted: true }}
        sx={{
          display: { xs: "block", md: "none" },
          "& .MuiDrawer-paper": {
            width: 240,
            boxSizing: "border-box",
          },
        }}
      >
        <NavBar role={userRole} />
      </Drawer>

      {/* Main content */}
      <Box
        sx={{
          flexGrow: 1,
          display: "flex",
          flexDirection: "column",
          backgroundColor: "#eee",
          overflow: "auto",
        }}
      >
        <Box
          sx={{
            position: "sticky",
            top: 0,
            zIndex: 1000,
            backgroundColor: "#eee",
          }}
        >
          <Header onMenuClick={handleDrawerToggle} />
        </Box>
        <Box
          component="main"
          sx={{
            flexGrow: 1,
            p: 3,
          }}
        >
          {children}
        </Box>
      </Box>
    </Box>
  );
};
