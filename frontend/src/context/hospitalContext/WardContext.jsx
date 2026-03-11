import { createContext, useEffect, useState } from "react";
import hospitalService from "../../services/hospitalService";

export const WardContext = createContext();

const MOCK_WARDS = [
  { id: 1, name: "General Ward A", type: "General", floor: "2nd Floor", totalBeds: 30, occupiedBeds: 22, availableBeds: 8, nurseStation: "NS-2A", status: "Active" },
  { id: 2, name: "General Ward B", type: "General", floor: "2nd Floor", totalBeds: 30, occupiedBeds: 25, availableBeds: 5, nurseStation: "NS-2B", status: "Active" },
  { id: 3, name: "ICU", type: "ICU", floor: "3rd Floor", totalBeds: 12, occupiedBeds: 10, availableBeds: 2, nurseStation: "NS-3A", status: "Active" },
  { id: 4, name: "Pediatric Ward", type: "Pediatric", floor: "4th Floor", totalBeds: 20, occupiedBeds: 15, availableBeds: 5, nurseStation: "NS-4A", status: "Active" },
  { id: 5, name: "Maternity Ward", type: "Maternity", floor: "5th Floor", totalBeds: 25, occupiedBeds: 18, availableBeds: 7, nurseStation: "NS-5A", status: "Active" },
  { id: 6, name: "Surgical Ward", type: "Surgical", floor: "3rd Floor", totalBeds: 28, occupiedBeds: 20, availableBeds: 8, nurseStation: "NS-3B", status: "Active" },
  { id: 7, name: "Cardiac Care Unit", type: "CCU", floor: "3rd Floor", totalBeds: 10, occupiedBeds: 8, availableBeds: 2, nurseStation: "NS-3C", status: "Active" },
  { id: 8, name: "Orthopedic Ward", type: "Orthopedic", floor: "6th Floor", totalBeds: 24, occupiedBeds: 19, availableBeds: 5, nurseStation: "NS-6A", status: "Active" },
];

const MOCK_BEDS = [
  { id: 1, wardId: 1, bedNumber: "A-101", status: "Occupied", patientId: "P001", patientName: "John Doe", admissionDate: "2024-01-15", condition: "Stable" },
  { id: 2, wardId: 1, bedNumber: "A-102", status: "Available", patientId: null, patientName: null, admissionDate: null, condition: null },
  { id: 3, wardId: 3, bedNumber: "ICU-01", status: "Occupied", patientId: "P010", patientName: "Jane Smith", admissionDate: "2024-01-20", condition: "Critical", ventilator: true },
  { id: 4, wardId: 3, bedNumber: "ICU-02", status: "Occupied", patientId: "P011", patientName: "Bob Johnson", admissionDate: "2024-01-21", condition: "Serious", ventilator: false },
];

export const WardProvider = ({ children }) => {
  const [wards, setWards] = useState(MOCK_WARDS);
  const [beds, setBeds] = useState(MOCK_BEDS);
  const [loading, setLoading] = useState(false);

  const fetchWards = async () => {
    setLoading(true);
    try {
      const res = await hospitalService.getWards();
      if (res.data && res.data.length > 0) {
        setWards(res.data);
      } else {
        setWards(MOCK_WARDS);
      }
    } catch (error) {
      console.error("Failed to fetch wards:", error);
      setWards(MOCK_WARDS);
    }
    setLoading(false);
  };

  const getWardById = (id) => {
    return wards.find(w => w.id === parseInt(id)) || null;
  };

  const getBedsByWard = (wardId) => {
    return beds.filter(b => b.wardId === parseInt(wardId));
  };

  const allocateBed = async (data) => {
    try {
      const newBed = {
        id: beds.length + 1,
        wardId: parseInt(data.wardId),
        bedNumber: data.bedNumber,
        status: "Occupied",
        patientId: data.patientId,
        patientName: data.patientName,
        admissionDate: data.admissionDate,
        condition: data.condition || "Stable",
        notes: data.notes
      };
      
      setBeds([...beds, newBed]);
      
      const updatedWards = wards.map(w => {
        if (w.id === parseInt(data.wardId)) {
          return {
            ...w,
            occupiedBeds: w.occupiedBeds + 1,
            availableBeds: w.availableBeds - 1
          };
        }
        return w;
      });
      setWards(updatedWards);

      try {
        await hospitalService.assignBed(data);
      } catch (err) {
        console.warn("Backend update failed, using local state");
      }
    } catch (error) {
      console.error("Failed to allocate bed:", error);
      throw error;
    }
  };

  const dischargeBed = async (bedId) => {
    try {
      const bed = beds.find(b => b.id === bedId);
      if (!bed) return;

      const updatedBeds = beds.map(b => 
        b.id === bedId 
          ? { ...b, status: "Available", patientId: null, patientName: null, admissionDate: null, condition: null }
          : b
      );
      setBeds(updatedBeds);

      const updatedWards = wards.map(w => {
        if (w.id === bed.wardId) {
          return {
            ...w,
            occupiedBeds: w.occupiedBeds - 1,
            availableBeds: w.availableBeds + 1
          };
        }
        return w;
      });
      setWards(updatedWards);
    } catch (error) {
      console.error("Failed to discharge bed:", error);
      throw error;
    }
  };

  const getICUPatients = () => {
    const icuWard = wards.find(w => w.type === "ICU");
    if (!icuWard) return [];
    return beds.filter(b => b.wardId === icuWard.id && b.status === "Occupied");
  };

  useEffect(() => {
    fetchWards();
  }, []);

  return (
    <WardContext.Provider value={{ 
      wards, 
      beds, 
      loading, 
      fetchWards, 
      getWardById, 
      getBedsByWard, 
      allocateBed, 
      dischargeBed,
      getICUPatients
    }}>
      {children}
    </WardContext.Provider>
  );
};
