import { useContext } from 'react';
import { HospitalReportContext } from '../context/hospitalContext/HospitalReportContext';

export const useReports = () => {
  const context = useContext(HospitalReportContext);
  if (!context) {
    throw new Error('useReports must be used within HospitalReportProvider');
  }
  return context;
};
