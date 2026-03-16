# Medical Record View - User Guide

## Accessing Medical Records

Navigate to: `http://localhost:5173/hospital/medical-records/:recordId`

Example: `http://localhost:5173/hospital/medical-records/nyr5MdqXgl6eCAWlv69E`

## Page Sections

### 1. Patient Overview Card
**Location**: Top left
**Information Displayed**:
- Patient Name
- Record Number
- Visit Date
- Visit Type (Emergency, Outpatient, Inpatient, etc.)
- Primary Doctor
- Blood Type
- Status Badge

### 2. Latest Vital Signs Card
**Location**: Top right (spans 2 columns)
**Information Displayed**:
- Temperature (°C or °F)
- Blood Pressure (systolic/diastolic mmHg)
- Heart Rate (bpm)
- Oxygen Saturation (SpO₂ %)
- Weight (kg)
- Height (cm)
- BMI (calculated)
- Respiratory Rate (/min)
- Recorded timestamp
- Clinical alerts (if any)

**Actions**:
- "View Trends" button - See vital signs over time

### 3. Vital Signs History Table
**Location**: Full width below vital signs
**Displayed When**: Patient has more than one vital signs record
**Columns**:
- Date/Time
- Temperature
- Blood Pressure
- Heart Rate
- SpO₂
- Respiratory Rate
- Recorded By

**Features**:
- Scrollable table (max height 400px)
- Sticky header
- Chronological order (newest first)

### 4. Chief Complaint
**Information Displayed**:
- Primary reason for visit
- Duration of symptoms
- Severity level (with badge)

### 5. History of Present Illness
**Information Displayed**:
- Detailed description of current condition
- Onset, location, duration, character
- Aggravating/relieving factors

### 6. Medical History
**Information Displayed**:
- Past Medical History
- Surgical History
- Family History
- Social History

### 7. Allergies & Current Medications
**Information Displayed**:
- Known allergies (or "None")
- Current medications with dosage

### 8. Physical Examination & Review of Systems
**Information Displayed**:
- Physical examination findings
- System-by-system review

### 9. Assessment & Diagnosis
**Information Displayed**:
- Primary Diagnosis
- Differential Diagnosis
- Diagnosis Entries (with ICD codes and status)

### 10. Diagnostic Tests Ordered
**Information Displayed**:
- Laboratory tests ordered
- Imaging studies ordered

### 11. Laboratory Test Results
**Location**: Full width table
**Columns**:
- Test Name
- Status (with color-coded badge)
- Ordered Date
- Completed Date
- Results
- Actions (View Details button for completed tests)

**Status Colors**:
- 🟢 Green = Completed
- 🟡 Yellow = Pending
- 🔵 Blue = In Progress

**Actions**:
- "Order New Test" button - Create new lab order
- "View Details" button - See full test results

### 12. Imaging & Radiology
**Information Displayed**:
- Imaging type (X-Ray, CT, MRI, etc.)
- Findings
- Date performed

### 13. Treatment Plan
**Information Displayed**:
- Treatment plan details
- Prescriptions (medication, dosage, frequency)
- Follow-up instructions

### 14. Additional Notes
**Information Displayed**:
- Clinical notes
- Additional observations

## Quick Actions (Top Right)

1. **Record Vitals** - Add new vital signs for this patient
2. **Order Lab Tests** - Create new lab order
3. **Add Diagnosis** - Add diagnosis entry
4. **Prescription** - Create prescription
5. **Back** - Return to medical records list

## Recording Vital Signs

### Steps:
1. Click "Record Vitals" button
2. Fill in vital signs form:
   - Temperature (with unit selection)
   - Blood Pressure (systolic/diastolic)
   - Heart Rate
   - Respiratory Rate
   - Oxygen Saturation
   - Weight & Height (BMI auto-calculated)
   - Blood Glucose
   - Pain Scale (0-10)
3. Review clinical alerts (if any)
4. Click "Save Vital Signs"
5. Automatically redirected to medical record view

### Clinical Alerts:
The system automatically detects and alerts for:
- 🔴 **Critical**: Fever (>38°C), Hypertensive Crisis, Critical Hypoxemia, Hyperglycemia, Hypoglycemia
- 🟡 **Warning**: Hypothermia, High/Low BP, Tachycardia, Low Oxygen, Tachypnea, Bradypnea
- 🔵 **Info**: Bradycardia

## Viewing Lab Results

### For Completed Tests:
1. Locate test in "Laboratory Test Results" table
2. Click "View Details" button
3. View comprehensive test results

### For Pending Tests:
- Status shows as "Pending"
- No action button available
- Check back later for results

## Data Refresh

The page automatically loads:
- Latest vital signs from database
- All vital signs history
- All lab test orders for the patient
- Complete medical record information

## Tips for Best Use

1. **Regular Updates**: Record vital signs regularly for accurate trends
2. **Complete Information**: Fill all relevant sections for comprehensive records
3. **Review Alerts**: Pay attention to clinical alerts in vital signs
4. **Follow-up**: Use follow-up instructions for patient care continuity
5. **Lab Tracking**: Monitor lab test status for timely results review

## Troubleshooting

### No Vital Signs Displayed
- Check if vital signs have been recorded for this patient
- Click "Record Vitals" to add first entry

### No Lab Results Displayed
- Verify lab tests have been ordered for this patient
- Check if tests are still pending
- Use "Order New Test" to create lab order

### Missing Medical Record Sections
- Sections only display if data exists
- Edit medical record to add missing information

## Professional Features

✅ Real-time data from database
✅ Clinical decision support with alerts
✅ Comprehensive patient history
✅ Professional medical formatting
✅ Easy navigation and quick actions
✅ Responsive design for all devices
✅ Print-friendly layout
✅ HIPAA-compliant data handling

---

**For Technical Support**: Contact IT Department
**For Clinical Questions**: Contact Medical Records Department
