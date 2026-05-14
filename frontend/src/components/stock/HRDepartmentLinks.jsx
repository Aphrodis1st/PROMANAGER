import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Box, Typography, Collapse } from "@mui/material";
import { ExpandLess, ExpandMore, People, Business, Schedule, EventNote, AttachMoney, Description, Assessment } from "@mui/icons-material";

export default function HRDepartmentLinks({ theme, themeColors }) {
  const [open, setOpen] = useState(false);

  const hrLinks = [
    { name: "Employees", path: "/stock/hr/employees", icon: <People /> },
    { name: "Departments", path: "/stock/hr/departments", icon: <Business /> },
    { name: "Attendance", path: "/stock/hr/attendance", icon: <Schedule /> },
    { name: "Leave Management", path: "/stock/hr/leave", icon: <EventNote /> },
    { name: "Payroll", path: "/stock/hr/payroll", icon: <AttachMoney /> },
    { name: "Contracts", path: "/stock/hr/contracts", icon: <Description /> },
    { name: "Performance", path: "/stock/hr/performance", icon: <Assessment /> },
  ];

  return (
    <>
      <Box
        onClick={() => setOpen(!open)}
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          p: 1.5,
          borderRadius: 2,
          cursor: "pointer",
          bgcolor: "rgba(255, 255, 255, 0.1)",
          "&:hover": {
            bgcolor: "rgba(255, 255, 255, 0.15)",
          },
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
          <People sx={{ fontSize: 20 }} />
          <Typography variant="body2" sx={{ fontWeight: 600 }}>
            HR Department
          </Typography>
        </Box>
        {open ? <ExpandLess /> : <ExpandMore />}
      </Box>

      <Collapse in={open} timeout="auto" unmountOnExit>
        <Box sx={{ pl: 2, display: "flex", flexDirection: "column", gap: 0.5 }}>
          {hrLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              style={{ textDecoration: "none" }}
            >
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 1.5,
                  p: 1,
                  pl: 2,
                  borderRadius: 1.5,
                  color: "rgba(255, 255, 255, 0.85)",
                  transition: "all 0.2s",
                  "&:hover": {
                    bgcolor: "rgba(255, 255, 255, 0.1)",
                    color: "white",
                    transform: "translateX(4px)",
                  },
                }}
              >
                <Box sx={{ fontSize: 18 }}>{link.icon}</Box>
                <Typography variant="body2" sx={{ fontSize: "0.875rem" }}>
                  {link.name}
                </Typography>
              </Box>
            </Link>
          ))}
        </Box>
      </Collapse>
    </>
  );
}
