import { createContext, useEffect, useState } from "react";
import hospitalService from "../../services/hospitalService";

export const DoctorContext = createContext();

export const DoctorProvider = ({ children }) => {
  const [doctors, setDoctors] = useState([]);
  const [doctor, setDoctor] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchDoctors = async () => {
    setLoading(true);
    try {
      const res = await hospitalService.getDoctors();
      console.log("Fetched doctors response:", res);
      const doctorsList = res.data || res || [];
      console.log("Setting doctors:", doctorsList);
      setDoctors(doctorsList);
    } catch (error) {
      console.error("Failed to fetch doctors:", error);
      // Add mock doctors for testing when API fails
      setDoctors([
        {
          id: 'doctor-1',
          fullName: 'Dr. Sarah Wilson',
          name: 'Dr. Sarah Wilson',
          specialization: 'Cardiology',
          email: 'sarah.wilson@hospital.com',
          phone: '555-0101',
          department: 'Cardiology'
        },
        {
          id: 'doctor-2',
          fullName: 'Dr. Michael Brown',
          name: 'Dr. Michael Brown', 
          specialization: 'Neurology',
          email: 'michael.brown@hospital.com',
          phone: '555-0102',
          department: 'Neurology'
        },
        {
          id: 'doctor-3',
          fullName: 'Dr. Emily Davis',
          name: 'Dr. Emily Davis',
          specialization: 'Pediatrics',
          email: 'emily.davis@hospital.com',
          phone: '555-0103',
          department: 'Pediatrics'
        },
        {
          id: 'doctor-4',
          fullName: 'Dr. Robert Taylor',
          name: 'Dr. Robert Taylor',
          specialization: 'General Medicine',
          email: 'robert.taylor@hospital.com',
          phone: '555-0104',
          department: 'General Medicine'
        }
      ]);
    }
    setLoading(false);
  };

  const fetchDoctorById = async (id) => {
    const found = doctors.find(d => d.id === id);
    setDoctor(found || null);
    return found || null;
  };

  const createDoctor = async (data) => {
    try {
      const result = await hospitalService.createDoctor(data);
      await fetchDoctors();
      return result;
    } catch (error) {
      console.error("Failed to create doctor:", error);
      throw error;
    }
  };

  const updateDoctor = async (id, data) => {
    try {
      await hospitalService.updateDoctor(id, data);
      await fetchDoctors();
    } catch (error) {
      console.error("Failed to update doctor:", error);
    }
  };

  const deleteDoctor = async (id) => {
    try {
      await hospitalService.deleteDoctor(id);
      await fetchDoctors();
    } catch (error) {
      console.error("Failed to delete doctor:", error);
    }
  };

  useEffect(() => {
    fetchDoctors();
  }, []);

  return (
    <DoctorContext.Provider value={{ doctors, doctor, loading, fetchDoctors, fetchDoctorById, createDoctor, updateDoctor, deleteDoctor }}>
      {children}
    </DoctorContext.Provider>
  );
};