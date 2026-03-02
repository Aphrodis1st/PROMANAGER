import { useContext } from "react";
import { BillingContext } from "../context/hospitalContext/BillingContext";

export const useBilling = () => {
  const context = useContext(BillingContext);
  if (!context) {
    throw new Error("useBilling must be used within BillingProvider");
  }
  return context;
};
