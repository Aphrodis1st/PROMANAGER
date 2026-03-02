import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Clinics() {
  const navigate = useNavigate();

  useEffect(() => {
    navigate('/hospital/dashboard');
  }, [navigate]);

  return null;
}
