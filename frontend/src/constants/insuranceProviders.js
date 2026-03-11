export const INSURANCE_PROVIDERS = [
  { id: 1, name: "Blue Cross Blue Shield", code: "BCBS", type: "Private", status: "Active" },
  { id: 2, name: "Aetna", code: "AETNA", type: "Private", status: "Active" },
  { id: 3, name: "United Healthcare", code: "UHC", type: "Private", status: "Active" },
  { id: 4, name: "Cigna", code: "CIGNA", type: "Private", status: "Active" },
  { id: 5, name: "Humana", code: "HUMANA", type: "Private", status: "Active" },
  { id: 6, name: "Kaiser Permanente", code: "KAISER", type: "HMO", status: "Active" },
  { id: 7, name: "Anthem", code: "ANTHEM", type: "Private", status: "Active" },
  { id: 8, name: "Medicare", code: "MEDICARE", type: "Government", status: "Active" },
  { id: 9, name: "Medicaid", code: "MEDICAID", type: "Government", status: "Active" },
  { id: 10, name: "Tricare", code: "TRICARE", type: "Military", status: "Active" },
  { id: 11, name: "Molina Healthcare", code: "MOLINA", type: "Private", status: "Active" },
  { id: 12, name: "Centene", code: "CENTENE", type: "Private", status: "Active" },
  { id: 13, name: "WellCare", code: "WELLCARE", type: "Private", status: "Active" },
  { id: 14, name: "Health Net", code: "HEALTHNET", type: "Private", status: "Active" },
  { id: 15, name: "Oscar Health", code: "OSCAR", type: "Private", status: "Active" },
];

export const PAYMENT_METHODS = [
  { id: 1, name: "Cash", icon: "💵", requiresReference: false },
  { id: 2, name: "Credit Card", icon: "💳", requiresReference: true },
  { id: 3, name: "Debit Card", icon: "💳", requiresReference: true },
  { id: 4, name: "Bank Transfer", icon: "🏦", requiresReference: true },
  { id: 5, name: "Insurance", icon: "🏥", requiresReference: true, requiresProvider: true },
  { id: 6, name: "Check", icon: "📝", requiresReference: true },
  { id: 7, name: "Mobile Payment", icon: "📱", requiresReference: true },
  { id: 8, name: "Wire Transfer", icon: "💸", requiresReference: true },
];
