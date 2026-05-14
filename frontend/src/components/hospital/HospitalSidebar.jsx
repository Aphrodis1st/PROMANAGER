import React, { useState } from "react";
import {
  Drawer,
  Box,
  Typography,
  IconButton,
  Tooltip,
} from "@mui/material";
import {
  LocalHospital as HospitalIcon,
  Palette as PaletteIcon,
  Person as PersonIcon,
  VpnKey as KeyIcon,
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";

import DashboardLinks from "./hospitalLink/DashboardLinks";
import ClinicalLinks from "./hospitalLink/ClinicalLinks";
import ManagementLinks from "./hospitalLink/ManagementLinks";
import FinancialLinks from "./hospitalLink/FinancialLinks";
import ReportLinks from "./hospitalLink/ReportLinks";
import AdminLinks from "./hospitalLink/AdminLinks";
import HRDepartmentLinks from "./hospitalLink/HRDepartmentLinks";
import { useHospitalAuth } from "../../context/HospitalAuthContext";

const drawerWidth = 320;

export default function HospitalSidebar() {
  const [theme, setTheme] = useState("blue");
  const { hospital, admin, logout } = useHospitalAuth();
  const navigate = useNavigate();

  const toggleTheme = () => {
    setTheme((prev) => (prev === "blue" ? "green" : "blue"));
  };

  const themeColors = {
    blue: {
      primary: "#2563eb",
      secondary: "#3b82f6",
      dark: "#1e3a8a",
      gradient: "linear-gradient(180deg, #1e3a8a 0%, #2563eb 50%, #3b82f6 100%)",
    },
    green: {
      primary: "#16a34a",
      secondary: "#22c55e",
      dark: "#14532d",
      gradient: "linear-gradient(180deg, #14532d 0%, #16a34a 50%, #22c55e 100%)",
    },
  };

  const currentTheme = themeColors[theme];

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        "& .MuiDrawer-paper": {
          width: drawerWidth,
          boxSizing: "border-box",
          background: currentTheme.gradient,
          color: "white",
          boxShadow: "4px 0 20px rgba(0,0,0,0.2)",
          borderRight: "none",
        },
      }}
    >
      <Box sx={{ display: "flex", flexDirection: "column", height: "100%" }}>
        
        {/* Header */}
        <Box
          sx={{
            p: 3,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            borderBottom: "1px solid rgba(255,255,255,0.2)",
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
            <HospitalIcon sx={{ fontSize: 32 }} />
            <Box>
              <Typography variant="h6" sx={{ fontWeight: 700, lineHeight: 1.2 }}>
                {hospital?.name || 'E-Hospital'}
              </Typography>
              {admin?.email && (
                <Typography variant="caption" sx={{ opacity: 0.75 }}>
                  {admin.email}
                </Typography>
              )}
            </Box>
          </Box>

          <Tooltip title="Switch Theme">
            <IconButton
              onClick={toggleTheme}
              sx={{
                color: "white",
                bgcolor: "rgba(255,255,255,0.2)",
                "&:hover": { bgcolor: "rgba(255,255,255,0.3)" },
              }}
              size="small"
            >
              <PaletteIcon />
            </IconButton>
          </Tooltip>
        </Box>

        {/* Navigation */}
        <Box
          sx={{
            flex: 1,
            overflow: "auto",
            px: 2,
            py: 3,
          }}
        >
          <Box component="ul" sx={{ listStyle: "none", p: 0, m: 0, display: "flex", flexDirection: "column", gap: 1.5 }}>
            
            <DashboardLinks />
            <ClinicalLinks />
            <ManagementLinks />
            <FinancialLinks />
            <HRDepartmentLinks />
            <ReportLinks />
            <AdminLinks />

          </Box>
        </Box>

        {/* Admin Profile Section */}
        {admin && (admin.role === 'hospital_admin' || admin.role === 'admin') && (
          <Box
            sx={{
              p: 2,
              borderTop: "1px solid rgba(255,255,255,0.1)",
              borderBottom: "1px solid rgba(255,255,255,0.1)",
            }}
          >
            <Typography variant="caption" sx={{ opacity: 0.8, fontWeight: 600, mb: 1, display: 'block' }}>
              ADMIN PANEL
            </Typography>
            <Box sx={{ display: 'flex', gap: 1 }}>
              <Tooltip title="Admin Profile">
                <IconButton
                  onClick={() => navigate('/hospital/admin/profile')}
                  sx={{
                    color: "white",
                    bgcolor: "rgba(255,255,255,0.15)",
                    "&:hover": { bgcolor: "rgba(255,255,255,0.25)" },
                    flex: 1
                  }}
                  size="small"
                >
                  <PersonIcon fontSize="small" />
                </IconButton>
              </Tooltip>
              <Tooltip title="Change Password">
                <IconButton
                  onClick={() => navigate('/hospital/admin/profile?tab=security')}
                  sx={{
                    color: "white",
                    bgcolor: "rgba(255,255,255,0.15)",
                    "&:hover": { bgcolor: "rgba(255,255,255,0.25)" },
                    flex: 1
                  }}
                  size="small"
                >
                  <KeyIcon fontSize="small" />
                </IconButton>
              </Tooltip>
            </Box>
          </Box>
        )}

        {/* Footer */}
        <Box
          sx={{
            p: 2,
            textAlign: "center",
            borderTop: "1px solid rgba(255,255,255,0.1)",
          }}
        >
          <button
            onClick={logout}
            style={{
              background: 'rgba(255,255,255,0.15)',
              border: 'none',
              color: 'white',
              borderRadius: 8,
              padding: '8px 20px',
              cursor: 'pointer',
              fontWeight: 600,
              width: '100%',
              marginBottom: 8
            }}
          >
            Logout
          </button>
          <Typography variant="caption" sx={{ opacity: 0.7 }}>
            © 2026 E-Hospital System
          </Typography>
        </Box>
      </Box>
    </Drawer>
  );
}