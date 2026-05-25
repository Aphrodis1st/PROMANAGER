import React from "react";
import ProtectedRoute from "../ProtectedRoute.jsx";

export default function StockProtectedRoute({ children, roles = null, departments = null }) {
  return (
    <ProtectedRoute service="stock" roles={roles} departments={departments}>
      {children}
    </ProtectedRoute>
  );
}
