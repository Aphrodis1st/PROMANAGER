import React from "react";
import { NavLink } from "react-router-dom";
import {
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
import { Dashboard as DashboardIcon } from "@mui/icons-material";

export default function DashboardLinks({ themeColors }) {
  return (
    <ListItem disablePadding>
      <NavLink to="/stock" style={{ textDecoration: "none", width: "100%" }}>
        {({ isActive }) => (
          <ListItemButton
            sx={{
              borderRadius: 2,
              mb: 1,
              bgcolor: isActive ? themeColors.secondary : "rgba(255, 255, 255, 0.1)",
              "&:hover": {
                bgcolor: isActive ? themeColors.light : "rgba(255, 255, 255, 0.2)",
              },
              py: 1.5,
            }}
          >
            <ListItemIcon sx={{ minWidth: 40, color: "white" }}>
              <DashboardIcon />
            </ListItemIcon>
            <ListItemText
              primary="Dashboard Overview"
              primaryTypographyProps={{
                fontSize: "1rem",
                fontWeight: isActive ? 700 : 600,
                color: "white",
              }}
            />
          </ListItemButton>
        )}
      </NavLink>
    </ListItem>
  );
}
