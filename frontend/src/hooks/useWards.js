import { useContext } from 'react';
import { WardContext } from '../context/hospitalContext/WardContext';

export const useWards = () => {
  const context = useContext(WardContext);
  if (!context) {
    throw new Error('useWards must be used within WardProvider');
  }
  return context;
};
