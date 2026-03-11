export const HOSPITAL_DEPARTMENTS = [
  // Emergency & Critical Care
  { id: 1, name: "Emergency Medicine", code: "ER", description: "24/7 emergency and trauma care", location: "Ground Floor", numberOfBeds: 50, operatingHours: "24/7", status: "Active", totalDoctors: 15, totalNurses: 30, totalStaff: 50 },
  { id: 2, name: "Intensive Care Unit (ICU)", code: "ICU", description: "Critical care for severe conditions", location: "Floor 2", numberOfBeds: 30, operatingHours: "24/7", status: "Active", totalDoctors: 12, totalNurses: 40, totalStaff: 60 },
  { id: 3, name: "Trauma Surgery", code: "TRAUMA", description: "Emergency surgical care for injuries", location: "Floor 1", numberOfBeds: 20, operatingHours: "24/7", status: "Active", totalDoctors: 10, totalNurses: 25, totalStaff: 40 },
  { id: 4, name: "Burn Unit", code: "BURN", description: "Specialized burn treatment center", location: "Floor 3", numberOfBeds: 15, operatingHours: "24/7", status: "Active", totalDoctors: 8, totalNurses: 20, totalStaff: 35 },
  { id: 5, name: "Cardiac Care Unit (CCU)", code: "CCU", description: "Intensive cardiac monitoring", location: "Floor 2", numberOfBeds: 25, operatingHours: "24/7", status: "Active", totalDoctors: 10, totalNurses: 30, totalStaff: 45 },

  // Cardiology & Cardiovascular
  { id: 6, name: "Cardiology", code: "CARD", description: "Heart and cardiovascular diseases", location: "Floor 3", numberOfBeds: 40, operatingHours: "8AM-8PM", status: "Active", totalDoctors: 12, totalNurses: 25, totalStaff: 42 },
  { id: 7, name: "Cardiothoracic Surgery", code: "CTS", description: "Heart and chest surgery", location: "Floor 4", numberOfBeds: 20, operatingHours: "24/7", status: "Active", totalDoctors: 8, totalNurses: 18, totalStaff: 32 },
  { id: 8, name: "Vascular Surgery", code: "VASC", description: "Blood vessel and circulation surgery", location: "Floor 4", numberOfBeds: 15, operatingHours: "8AM-6PM", status: "Active", totalDoctors: 6, totalNurses: 12, totalStaff: 22 },
  { id: 9, name: "Interventional Cardiology", code: "INTCARD", description: "Catheterization and cardiac procedures", location: "Floor 3", numberOfBeds: 10, operatingHours: "24/7", status: "Active", totalDoctors: 7, totalNurses: 15, totalStaff: 25 },

  // Neurology & Neurosurgery
  { id: 10, name: "Neurology", code: "NEURO", description: "Brain and nervous system disorders", location: "Floor 5", numberOfBeds: 35, operatingHours: "24/7", status: "Active", totalDoctors: 10, totalNurses: 22, totalStaff: 38 },
  { id: 11, name: "Neurosurgery", code: "NSURG", description: "Brain and spinal cord surgery", location: "Floor 5", numberOfBeds: 20, operatingHours: "24/7", status: "Active", totalDoctors: 8, totalNurses: 18, totalStaff: 30 },
  { id: 12, name: "Stroke Unit", code: "STROKE", description: "Specialized stroke care", location: "Floor 5", numberOfBeds: 15, operatingHours: "24/7", status: "Active", totalDoctors: 6, totalNurses: 16, totalStaff: 26 },
  { id: 13, name: "Epilepsy Center", code: "EPIL", description: "Seizure disorder treatment", location: "Floor 5", numberOfBeds: 10, operatingHours: "8AM-6PM", status: "Active", totalDoctors: 4, totalNurses: 8, totalStaff: 15 },

  // Orthopedics & Rehabilitation
  { id: 14, name: "Orthopedics", code: "ORTHO", description: "Bone, joint, and muscle treatment", location: "Floor 6", numberOfBeds: 45, operatingHours: "8AM-8PM", status: "Active", totalDoctors: 14, totalNurses: 28, totalStaff: 48 },
  { id: 15, name: "Spine Surgery", code: "SPINE", description: "Spinal disorders and surgery", location: "Floor 6", numberOfBeds: 20, operatingHours: "8AM-6PM", status: "Active", totalDoctors: 7, totalNurses: 15, totalStaff: 26 },
  { id: 16, name: "Sports Medicine", code: "SPORT", description: "Athletic injuries and performance", location: "Floor 6", numberOfBeds: 15, operatingHours: "8AM-6PM", status: "Active", totalDoctors: 5, totalNurses: 10, totalStaff: 18 },
  { id: 17, name: "Physical Medicine & Rehabilitation", code: "PMR", description: "Recovery and physical therapy", location: "Floor 7", numberOfBeds: 30, operatingHours: "7AM-7PM", status: "Active", totalDoctors: 8, totalNurses: 20, totalStaff: 35 },
  { id: 18, name: "Joint Replacement Center", code: "JOINT", description: "Hip and knee replacement surgery", location: "Floor 6", numberOfBeds: 25, operatingHours: "8AM-6PM", status: "Active", totalDoctors: 6, totalNurses: 14, totalStaff: 24 },

  // Pediatrics & Neonatology
  { id: 19, name: "Pediatrics", code: "PEDS", description: "Children's healthcare", location: "Floor 8", numberOfBeds: 50, operatingHours: "24/7", status: "Active", totalDoctors: 16, totalNurses: 35, totalStaff: 58 },
  { id: 20, name: "Neonatology (NICU)", code: "NICU", description: "Newborn and premature infant care", location: "Floor 8", numberOfBeds: 30, operatingHours: "24/7", status: "Active", totalDoctors: 10, totalNurses: 40, totalStaff: 55 },
  { id: 21, name: "Pediatric Surgery", code: "PSURG", description: "Surgical care for children", location: "Floor 8", numberOfBeds: 20, operatingHours: "24/7", status: "Active", totalDoctors: 8, totalNurses: 18, totalStaff: 30 },
  { id: 22, name: "Pediatric Cardiology", code: "PCARD", description: "Children's heart conditions", location: "Floor 8", numberOfBeds: 15, operatingHours: "8AM-6PM", status: "Active", totalDoctors: 6, totalNurses: 12, totalStaff: 20 },
  { id: 23, name: "Pediatric Oncology", code: "PONC", description: "Childhood cancer treatment", location: "Floor 9", numberOfBeds: 20, operatingHours: "24/7", status: "Active", totalDoctors: 7, totalNurses: 18, totalStaff: 28 },

  // Obstetrics & Gynecology
  { id: 24, name: "Obstetrics & Gynecology", code: "OBGYN", description: "Women's health and childbirth", location: "Floor 10", numberOfBeds: 40, operatingHours: "24/7", status: "Active", totalDoctors: 12, totalNurses: 30, totalStaff: 48 },
  { id: 25, name: "Labor & Delivery", code: "LD", description: "Childbirth and delivery services", location: "Floor 10", numberOfBeds: 25, operatingHours: "24/7", status: "Active", totalDoctors: 10, totalNurses: 35, totalStaff: 50 },
  { id: 26, name: "Maternal-Fetal Medicine", code: "MFM", description: "High-risk pregnancy care", location: "Floor 10", numberOfBeds: 15, operatingHours: "24/7", status: "Active", totalDoctors: 6, totalNurses: 15, totalStaff: 24 },
  { id: 27, name: "Gynecologic Oncology", code: "GYNONC", description: "Women's cancer treatment", location: "Floor 10", numberOfBeds: 20, operatingHours: "8AM-6PM", status: "Active", totalDoctors: 5, totalNurses: 12, totalStaff: 20 },

  // Surgery Departments
  { id: 28, name: "General Surgery", code: "SURG", description: "General surgical procedures", location: "Floor 4", numberOfBeds: 50, operatingHours: "24/7", status: "Active", totalDoctors: 15, totalNurses: 32, totalStaff: 52 },
  { id: 29, name: "Plastic Surgery", code: "PLAST", description: "Reconstructive and cosmetic surgery", location: "Floor 4", numberOfBeds: 20, operatingHours: "8AM-6PM", status: "Active", totalDoctors: 7, totalNurses: 14, totalStaff: 24 },
  { id: 30, name: "Bariatric Surgery", code: "BARI", description: "Weight loss surgery", location: "Floor 4", numberOfBeds: 15, operatingHours: "8AM-6PM", status: "Active", totalDoctors: 5, totalNurses: 10, totalStaff: 18 },
  { id: 31, name: "Transplant Surgery", code: "TRANS", description: "Organ transplantation", location: "Floor 4", numberOfBeds: 20, operatingHours: "24/7", status: "Active", totalDoctors: 8, totalNurses: 20, totalStaff: 32 },
  { id: 32, name: "Colorectal Surgery", code: "COLO", description: "Colon and rectal surgery", location: "Floor 4", numberOfBeds: 15, operatingHours: "8AM-6PM", status: "Active", totalDoctors: 5, totalNurses: 10, totalStaff: 18 },

  // Internal Medicine & Subspecialties
  { id: 33, name: "Internal Medicine", code: "IM", description: "Adult disease prevention and treatment", location: "Floor 11", numberOfBeds: 60, operatingHours: "24/7", status: "Active", totalDoctors: 18, totalNurses: 38, totalStaff: 62 },
  { id: 34, name: "Gastroenterology", code: "GI", description: "Digestive system disorders", location: "Floor 11", numberOfBeds: 30, operatingHours: "8AM-6PM", status: "Active", totalDoctors: 10, totalNurses: 20, totalStaff: 34 },
  { id: 35, name: "Pulmonology", code: "PULM", description: "Respiratory and lung diseases", location: "Floor 11", numberOfBeds: 35, operatingHours: "24/7", status: "Active", totalDoctors: 11, totalNurses: 24, totalStaff: 40 },
  { id: 36, name: "Nephrology", code: "NEPH", description: "Kidney diseases and dialysis", location: "Floor 11", numberOfBeds: 25, operatingHours: "24/7", status: "Active", totalDoctors: 8, totalNurses: 18, totalStaff: 30 },
  { id: 37, name: "Endocrinology", code: "ENDO", description: "Hormonal and metabolic disorders", location: "Floor 11", numberOfBeds: 20, operatingHours: "8AM-6PM", status: "Active", totalDoctors: 7, totalNurses: 14, totalStaff: 24 },
  { id: 38, name: "Rheumatology", code: "RHEUM", description: "Autoimmune and joint diseases", location: "Floor 11", numberOfBeds: 15, operatingHours: "8AM-6PM", status: "Active", totalDoctors: 5, totalNurses: 10, totalStaff: 18 },
  { id: 39, name: "Infectious Diseases", code: "ID", description: "Bacterial, viral, and parasitic infections", location: "Floor 11", numberOfBeds: 25, operatingHours: "24/7", status: "Active", totalDoctors: 8, totalNurses: 18, totalStaff: 30 },
  { id: 40, name: "Hematology", code: "HEM", description: "Blood disorders and diseases", location: "Floor 11", numberOfBeds: 20, operatingHours: "8AM-6PM", status: "Active", totalDoctors: 6, totalNurses: 14, totalStaff: 24 },

  // Oncology & Cancer Care
  { id: 41, name: "Oncology", code: "ONC", description: "Cancer treatment and care", location: "Floor 9", numberOfBeds: 45, operatingHours: "24/7", status: "Active", totalDoctors: 14, totalNurses: 32, totalStaff: 52 },
  { id: 42, name: "Radiation Oncology", code: "RADONC", description: "Radiation therapy for cancer", location: "Basement", numberOfBeds: 0, operatingHours: "8AM-6PM", status: "Active", totalDoctors: 6, totalNurses: 10, totalStaff: 20 },
  { id: 43, name: "Surgical Oncology", code: "SURGONC", description: "Cancer surgery", location: "Floor 9", numberOfBeds: 20, operatingHours: "8AM-6PM", status: "Active", totalDoctors: 7, totalNurses: 15, totalStaff: 26 },
  { id: 44, name: "Palliative Care", code: "PALL", description: "Comfort care for serious illness", location: "Floor 9", numberOfBeds: 25, operatingHours: "24/7", status: "Active", totalDoctors: 8, totalNurses: 20, totalStaff: 32 },

  // Specialty Departments
  { id: 45, name: "Dermatology", code: "DERM", description: "Skin, hair, and nail conditions", location: "Floor 12", numberOfBeds: 10, operatingHours: "8AM-6PM", status: "Active", totalDoctors: 6, totalNurses: 8, totalStaff: 16 },
  { id: 46, name: "Ophthalmology", code: "OPHT", description: "Eye care and vision", location: "Floor 12", numberOfBeds: 15, operatingHours: "8AM-6PM", status: "Active", totalDoctors: 8, totalNurses: 12, totalStaff: 22 },
  { id: 47, name: "ENT (Otolaryngology)", code: "ENT", description: "Ear, nose, and throat", location: "Floor 12", numberOfBeds: 20, operatingHours: "8AM-6PM", status: "Active", totalDoctors: 7, totalNurses: 14, totalStaff: 24 },
  { id: 48, name: "Urology", code: "URO", description: "Urinary tract and male reproductive system", location: "Floor 12", numberOfBeds: 25, operatingHours: "8AM-6PM", status: "Active", totalDoctors: 8, totalNurses: 16, totalStaff: 28 },
  { id: 49, name: "Allergy & Immunology", code: "AI", description: "Allergic reactions and immune disorders", location: "Floor 12", numberOfBeds: 10, operatingHours: "8AM-6PM", status: "Active", totalDoctors: 4, totalNurses: 8, totalStaff: 14 },

  // Mental Health & Psychiatry
  { id: 50, name: "Psychiatry", code: "PSYCH", description: "Mental health and behavioral disorders", location: "Floor 13", numberOfBeds: 40, operatingHours: "24/7", status: "Active", totalDoctors: 12, totalNurses: 28, totalStaff: 45 },
  { id: 51, name: "Psychology", code: "PSYC", description: "Psychological counseling and therapy", location: "Floor 13", numberOfBeds: 0, operatingHours: "8AM-6PM", status: "Active", totalDoctors: 8, totalNurses: 4, totalStaff: 15 },
  { id: 52, name: "Addiction Medicine", code: "ADDICT", description: "Substance abuse treatment", location: "Floor 13", numberOfBeds: 30, operatingHours: "24/7", status: "Active", totalDoctors: 6, totalNurses: 18, totalStaff: 28 },
  { id: 53, name: "Child & Adolescent Psychiatry", code: "CPSYCH", description: "Youth mental health", location: "Floor 13", numberOfBeds: 20, operatingHours: "24/7", status: "Active", totalDoctors: 5, totalNurses: 15, totalStaff: 24 },

  // Geriatrics & Elderly Care
  { id: 54, name: "Geriatrics", code: "GER", description: "Elderly patient care", location: "Floor 14", numberOfBeds: 50, operatingHours: "24/7", status: "Active", totalDoctors: 10, totalNurses: 30, totalStaff: 48 },
  { id: 55, name: "Memory Care Unit", code: "MEMORY", description: "Dementia and Alzheimer's care", location: "Floor 14", numberOfBeds: 30, operatingHours: "24/7", status: "Active", totalDoctors: 6, totalNurses: 20, totalStaff: 32 },

  // Diagnostic & Support Services
  { id: 56, name: "Radiology", code: "RAD", description: "Medical imaging and diagnostics", location: "Basement", numberOfBeds: 0, operatingHours: "24/7", status: "Active", totalDoctors: 12, totalNurses: 8, totalStaff: 35 },
  { id: 57, name: "Nuclear Medicine", code: "NUC", description: "Radioactive imaging and therapy", location: "Basement", numberOfBeds: 0, operatingHours: "8AM-6PM", status: "Active", totalDoctors: 4, totalNurses: 6, totalStaff: 15 },
  { id: 58, name: "Pathology", code: "PATH", description: "Laboratory diagnosis and testing", location: "Basement", numberOfBeds: 0, operatingHours: "24/7", status: "Active", totalDoctors: 10, totalNurses: 5, totalStaff: 40 },
  { id: 59, name: "Clinical Laboratory", code: "LAB", description: "Blood tests and diagnostics", location: "Basement", numberOfBeds: 0, operatingHours: "24/7", status: "Active", totalDoctors: 6, totalNurses: 4, totalStaff: 30 },
  { id: 60, name: "Blood Bank", code: "BLOOD", description: "Blood donation and transfusion", location: "Basement", numberOfBeds: 0, operatingHours: "24/7", status: "Active", totalDoctors: 4, totalNurses: 8, totalStaff: 18 },

  // Anesthesia & Pain Management
  { id: 61, name: "Anesthesiology", code: "ANES", description: "Anesthesia and surgical support", location: "Floor 4", numberOfBeds: 0, operatingHours: "24/7", status: "Active", totalDoctors: 15, totalNurses: 20, totalStaff: 40 },
  { id: 62, name: "Pain Management", code: "PAIN", description: "Chronic pain treatment", location: "Floor 7", numberOfBeds: 10, operatingHours: "8AM-6PM", status: "Active", totalDoctors: 5, totalNurses: 8, totalStaff: 16 },

  // Specialized Treatment Centers
  { id: 63, name: "Dialysis Center", code: "DIAL", description: "Kidney dialysis services", location: "Floor 11", numberOfBeds: 20, operatingHours: "6AM-10PM", status: "Active", totalDoctors: 4, totalNurses: 16, totalStaff: 26 },
  { id: 64, name: "Wound Care Center", code: "WOUND", description: "Chronic wound management", location: "Floor 7", numberOfBeds: 10, operatingHours: "8AM-6PM", status: "Active", totalDoctors: 3, totalNurses: 8, totalStaff: 14 },
  { id: 65, name: "Sleep Medicine", code: "SLEEP", description: "Sleep disorders and treatment", location: "Floor 12", numberOfBeds: 15, operatingHours: "24/7", status: "Active", totalDoctors: 4, totalNurses: 10, totalStaff: 18 },
  { id: 66, name: "Hyperbaric Medicine", code: "HYPER", description: "Oxygen therapy treatment", location: "Basement", numberOfBeds: 5, operatingHours: "8AM-6PM", status: "Active", totalDoctors: 2, totalNurses: 4, totalStaff: 8 },

  // Genetics & Research
  { id: 67, name: "Clinical Genetics", code: "GEN", description: "Genetic disorders and counseling", location: "Floor 12", numberOfBeds: 0, operatingHours: "8AM-6PM", status: "Active", totalDoctors: 4, totalNurses: 2, totalStaff: 10 },
  { id: 68, name: "Medical Genetics", code: "MGEN", description: "Hereditary disease diagnosis", location: "Floor 12", numberOfBeds: 0, operatingHours: "8AM-6PM", status: "Active", totalDoctors: 3, totalNurses: 2, totalStaff: 8 },

  // Occupational & Preventive Medicine
  { id: 69, name: "Occupational Medicine", code: "OCC", description: "Workplace health and safety", location: "Floor 1", numberOfBeds: 0, operatingHours: "8AM-6PM", status: "Active", totalDoctors: 4, totalNurses: 6, totalStaff: 12 },
  { id: 70, name: "Preventive Medicine", code: "PREV", description: "Disease prevention and wellness", location: "Floor 1", numberOfBeds: 0, operatingHours: "8AM-6PM", status: "Active", totalDoctors: 5, totalNurses: 8, totalStaff: 16 },
  { id: 71, name: "Travel Medicine", code: "TRAVEL", description: "International travel health", location: "Floor 1", numberOfBeds: 0, operatingHours: "8AM-6PM", status: "Active", totalDoctors: 3, totalNurses: 4, totalStaff: 9 },

  // Support & Allied Services
  { id: 72, name: "Nutrition & Dietetics", code: "NUTR", description: "Dietary counseling and therapy", location: "Floor 1", numberOfBeds: 0, operatingHours: "8AM-6PM", status: "Active", totalDoctors: 2, totalNurses: 0, totalStaff: 15 },
  { id: 73, name: "Pharmacy Services", code: "PHARM", description: "Medication management and dispensing", location: "Ground Floor", numberOfBeds: 0, operatingHours: "24/7", status: "Active", totalDoctors: 0, totalNurses: 0, totalStaff: 25 },
  { id: 74, name: "Social Services", code: "SOCIAL", description: "Patient support and counseling", location: "Floor 1", numberOfBeds: 0, operatingHours: "8AM-6PM", status: "Active", totalDoctors: 0, totalNurses: 0, totalStaff: 12 },
  { id: 75, name: "Chaplaincy Services", code: "CHAP", description: "Spiritual care and support", location: "Floor 1", numberOfBeds: 0, operatingHours: "24/7", status: "Active", totalDoctors: 0, totalNurses: 0, totalStaff: 8 },

  // Outpatient & Ambulatory Care
  { id: 76, name: "Outpatient Clinic", code: "OPD", description: "General outpatient services", location: "Ground Floor", numberOfBeds: 0, operatingHours: "8AM-8PM", status: "Active", totalDoctors: 20, totalNurses: 30, totalStaff: 60 },
  { id: 77, name: "Ambulatory Surgery Center", code: "ASC", description: "Same-day surgical procedures", location: "Floor 4", numberOfBeds: 15, operatingHours: "7AM-7PM", status: "Active", totalDoctors: 10, totalNurses: 20, totalStaff: 35 },
  { id: 78, name: "Urgent Care", code: "UC", description: "Non-emergency urgent treatment", location: "Ground Floor", numberOfBeds: 20, operatingHours: "24/7", status: "Active", totalDoctors: 12, totalNurses: 24, totalStaff: 40 },

  // Administrative & Quality
  { id: 79, name: "Infection Control", code: "INFECT", description: "Hospital infection prevention", location: "Floor 1", numberOfBeds: 0, operatingHours: "8AM-6PM", status: "Active", totalDoctors: 3, totalNurses: 5, totalStaff: 10 },
  { id: 80, name: "Quality Assurance", code: "QA", description: "Healthcare quality monitoring", location: "Floor 1", numberOfBeds: 0, operatingHours: "8AM-6PM", status: "Active", totalDoctors: 2, totalNurses: 3, totalStaff: 12 }
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
