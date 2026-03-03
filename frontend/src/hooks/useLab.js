import { useContext } from 'react';
import { LabContext } from '../context/hospitalContext/LabContext';

export const useLab = () => {
  const context = useContext(LabContext);
  if (!context) {
    throw new Error('useLab must be used within LabProvider');
  }
  return context;
};
