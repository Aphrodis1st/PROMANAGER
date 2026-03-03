export const HOSPITAL_DEPARTMENTS = [
  { id: 1, name: "Emergency Medicine", code: "ER", description: "Emergency and trauma care" },
  { id: 2, name: "Cardiology", code: "CARD", description: "Heart and cardiovascular diseases" },
  { id: 3, name: "Neurology", code: "NEURO", description: "Brain and nervous system disorders" },
  { id: 4, name: "Orthopedics", code: "ORTHO", description: "Bone, joint, and muscle treatment" },
  { id: 5, name: "Pediatrics", code: "PEDS", description: "Children's healthcare" },
  { id: 6, name: "Obstetrics & Gynecology", code: "OBGYN", description: "Women's health and childbirth" },
  { id: 7, name: "General Surgery", code: "SURG", description: "Surgical procedures" },
  { id: 8, name: "Internal Medicine", code: "IM", description: "Adult disease prevention and treatment" },
  { id: 9, name: "Radiology", code: "RAD", description: "Medical imaging and diagnostics" },
  { id: 10, name: "Anesthesiology", code: "ANES", description: "Anesthesia and pain management" },
  { id: 11, name: "Oncology", code: "ONC", description: "Cancer treatment and care" },
  { id: 12, name: "Dermatology", code: "DERM", description: "Skin, hair, and nail conditions" },
  { id: 13, name: "Ophthalmology", code: "OPHT", description: "Eye care and vision" },
  { id: 14, name: "ENT (Otolaryngology)", code: "ENT", description: "Ear, nose, and throat" },
  { id: 15, name: "Psychiatry", code: "PSYCH", description: "Mental health and behavioral disorders" },
  { id: 16, name: "Nephrology", code: "NEPH", description: "Kidney diseases and dialysis" },
  { id: 17, name: "Gastroenterology", code: "GI", description: "Digestive system disorders" },
  { id: 18, name: "Pulmonology", code: "PULM", description: "Respiratory and lung diseases" },
  { id: 19, name: "Endocrinology", code: "ENDO", description: "Hormonal and metabolic disorders" },
  { id: 20, name: "Urology", code: "URO", description: "Urinary tract and male reproductive system" },
  { id: 21, name: "Rheumatology", code: "RHEUM", description: "Autoimmune and joint diseases" },
  { id: 22, name: "Intensive Care Unit (ICU)", code: "ICU", description: "Critical care for severe conditions" },
  { id: 23, name: "Pathology", code: "PATH", description: "Laboratory diagnosis and testing" },
  { id: 24, name: "Physical Medicine & Rehabilitation", code: "PMR", description: "Recovery and physical therapy" },
  { id: 25, name: "Hematology", code: "HEM", description: "Blood disorders and diseases" },
  { id: 26, name: "Infectious Diseases", code: "ID", description: "Bacterial, viral, and parasitic infections" },
  { id: 27, name: "Allergy & Immunology", code: "AI", description: "Allergic reactions and immune disorders" },
  { id: 28, name: "Plastic Surgery", code: "PLAST", description: "Reconstructive and cosmetic surgery" },
  { id: 29, name: "Vascular Surgery", code: "VASC", description: "Blood vessel and circulation surgery" },
  { id: 30, name: "Cardiothoracic Surgery", code: "CTS", description: "Heart and chest surgery" },
  { id: 31, name: "Neurosurgery", code: "NSURG", description: "Brain and spinal cord surgery" },
  { id: 32, name: "Pediatric Surgery", code: "PSURG", description: "Surgical care for children" },
  { id: 33, name: "Trauma Surgery", code: "TRAUMA", description: "Emergency surgical care for injuries" },
  { id: 34, name: "Neonatology", code: "NEO", description: "Newborn and premature infant care" },
  { id: 35, name: "Geriatrics", code: "GER", description: "Elderly patient care" },
  { id: 36, name: "Sports Medicine", code: "SPORT", description: "Athletic injuries and performance" },
  { id: 37, name: "Pain Management", code: "PAIN", description: "Chronic pain treatment" },
  { id: 38, name: "Sleep Medicine", code: "SLEEP", description: "Sleep disorders and treatment" },
  { id: 39, name: "Nuclear Medicine", code: "NUC", description: "Radioactive imaging and therapy" },
  { id: 40, name: "Clinical Genetics", code: "GEN", description: "Genetic disorders and counseling" },
  { id: 41, name: "Palliative Care", code: "PALL", description: "Comfort care for serious illness" },
  { id: 42, name: "Occupational Medicine", code: "OCC", description: "Workplace health and safety" },
  { id: 43, name: "Medical Genetics", code: "MGEN", description: "Hereditary disease diagnosis" },
  { id: 44, name: "Bariatric Surgery", code: "BARI", description: "Weight loss surgery" },
  { id: 45, name: "Transplant Surgery", code: "TRANS", description: "Organ transplantation" },
  { id: 46, name: "Burn Unit", code: "BURN", description: "Severe burn treatment" },
  { id: 47, name: "Dialysis Center", code: "DIAL", description: "Kidney dialysis services" },
  { id: 48, name: "Wound Care", code: "WOUND", description: "Chronic wound management" },
  { id: 49, name: "Nutrition & Dietetics", code: "NUTR", description: "Dietary counseling and therapy" },
  { id: 50, name: "Pharmacy Services", code: "PHARM", description: "Medication management and dispensing" }
];

export const getDepartmentOptions = () => 
  HOSPITAL_DEPARTMENTS.map(dept => ({ 
    label: dept.name, 
    value: dept.code 
  }));

export const getDepartmentByCode = (code) => 
  HOSPITAL_DEPARTMENTS.find(dept => dept.code === code);

export const getDepartmentById = (id) => 
  HOSPITAL_DEPARTMENTS.find(dept => dept.id === id);
