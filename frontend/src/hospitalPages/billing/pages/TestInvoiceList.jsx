import React from "react";

export default function TestInvoiceList() {
  return (
    <div style={{ padding: "2rem" }}>
      <h1>Invoice List - Test Page</h1>
      <p>This is a test to verify the page loads correctly.</p>
      <div style={{ 
        backgroundColor: "#f0f9ff", 
        padding: "1rem", 
        borderRadius: "0.5rem",
        border: "1px solid #3b82f6",
        marginTop: "1rem"
      }}>
        <h3>Test Status: ✅ Page Loading Successfully</h3>
        <p>If you can see this message, the routing and basic page structure is working.</p>
      </div>
    </div>
  );
}