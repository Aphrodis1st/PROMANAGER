import React from "react";

import { PatientProvider } from "./hospitalContext/PatientContext";
import { AppointmentProvider } from "./hospitalContext/AppointmentContext";
import { BillingProvider } from "./hospitalContext/BillingContext";
import { DoctorProvider } from "./hospitalContext/DoctorContext";
import { DepartmentProvider } from "./hospitalContext/DepartmentContext";
import { WardProvider } from "./hospitalContext/WardContext";
import { LabProvider } from "./hospitalContext/LabContext";
import { MedicalRecordProvider } from "./hospitalContext/MedicalRecordContext";
import { AdmissionProvider } from "./hospitalContext/AdmissionContext";
import { HospitalReportProvider } from "./hospitalContext/HospitalReportContext";

const HospitalProvider = ({ children }) => {
  return (
    <DoctorProvider>
      <DepartmentProvider>
        <PatientProvider>
          <AppointmentProvider>
            <BillingProvider>
              <WardProvider>
                <LabProvider>
                  <MedicalRecordProvider>
                    <AdmissionProvider>
                      <HospitalReportProvider>
                        {children}
                      </HospitalReportProvider>
                    </AdmissionProvider>
                  </MedicalRecordProvider>
                </LabProvider>
              </WardProvider>
            </BillingProvider>
          </AppointmentProvider>
        </PatientProvider>
      </DepartmentProvider>
    </DoctorProvider>
  );
};

export default HospitalProvider;