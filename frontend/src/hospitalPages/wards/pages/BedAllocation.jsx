import React, { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import PageHeader from "../../../components/hospital/PageHeader";
import Card from "../../../components/hospital/card";
import Button from "../../../components/hospital/Button";
import Badge from "../../../components/hospital/Badge";
import { useWards } from "../../../hooks/useWards";
import { usePatients } from "../../../hooks/usePatients";

export default function BedAllocation() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { wards, allocateBed, fetchWards } = useWards();
  const { patients, fetchPatients } = usePatients();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    patientId: "",
    wardId: searchParams.get("wardId") || "",
    bedNumber: "",
    admissionDate: new Date().toISOString().split('T')[0],
    condition: "Stable",
    notes: "",
  });

  useEffect(() => {
    fetchWards();
    fetchPatients();
  }, []);

  const selectedWard = wards.find(w => w.id === parseInt(formData.wardId));
  const selectedPatient = patients.find(p => p.id === formData.patientId);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.patientId || !formData.wardId || !formData.bedNumber) {
      alert("Please fill in all required fields");
      return;
    }

    setLoading(true);
    try {
      await allocateBed({
        ...formData,
        patientName: selectedPatient?.fullName || selectedPatient?.name || "Unknown"
      });
      alert("Bed allocated successfully!");
      navigate("/hospital/wards");
    } catch (error) {
      console.error("Error allocating bed:", error);
      alert("Failed to allocate bed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <PageHeader 
        title="Bed Allocation" 
        action={
          <Button variant="secondary" onClick={() => navigate("/hospital/wards")}>
            Cancel
          </Button>
        }
      />

      <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: "1.5rem" }}>
        <Card>
          <h3 style={{ fontSize: "1.125rem", fontWeight: "600", marginBottom: "1.5rem" }}>
            Allocation Details
          </h3>

          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: "1.5rem" }}>
              <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: "600" }}>
                Patient *
              </label>
              <select
                value={formData.patientId}
                onChange={(e) => setFormData({ ...formData, patientId: e.target.value })}
                style={{ 
                  width: "100%", 
                  padding: "0.75rem", 
                  border: "1px solid #d1d5db", 
                  borderRadius: "0.5rem",
                  fontSize: "0.875rem"
                }}
                required
              >
                <option value="">Select Patient</option>
                {patients?.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.fullName || p.name} - MRN: {p.mrn || p.id}
                  </option>
                ))}
              </select>
            </div>

            <div style={{ marginBottom: "1.5rem" }}>
              <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: "600" }}>
                Ward *
              </label>
              <select
                value={formData.wardId}
                onChange={(e) => setFormData({ ...formData, wardId: e.target.value })}
                style={{ 
                  width: "100%", 
                  padding: "0.75rem", 
                  border: "1px solid #d1d5db", 
                  borderRadius: "0.5rem",
                  fontSize: "0.875rem"
                }}
                required
              >
                <option value="">Select Ward</option>
                {wards?.map((w) => (
                  <option key={w.id} value={w.id} disabled={w.availableBeds === 0}>
                    {w.name} - {w.availableBeds} bed(s) available {w.availableBeds === 0 ? "(Full)" : ""}
                  </option>
                ))}
              </select>
            </div>

            <div style={{ marginBottom: "1.5rem" }}>
              <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: "600" }}>
                Bed Number *
              </label>
              <input
                type="text"
                value={formData.bedNumber}
                onChange={(e) => setFormData({ ...formData, bedNumber: e.target.value })}
                placeholder="e.g., A-101, ICU-05"
                style={{ 
                  width: "100%", 
                  padding: "0.75rem", 
                  border: "1px solid #d1d5db", 
                  borderRadius: "0.5rem",
                  fontSize: "0.875rem"
                }}
                required
              />
            </div>

            <div style={{ marginBottom: "1.5rem" }}>
              <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: "600" }}>
                Admission Date *
              </label>
              <input
                type="date"
                value={formData.admissionDate}
                onChange={(e) => setFormData({ ...formData, admissionDate: e.target.value })}
                style={{ 
                  width: "100%", 
                  padding: "0.75rem", 
                  border: "1px solid #d1d5db", 
                  borderRadius: "0.5rem",
                  fontSize: "0.875rem"
                }}
                required
              />
            </div>

            <div style={{ marginBottom: "1.5rem" }}>
              <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: "600" }}>
                Patient Condition *
              </label>
              <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
                {["Stable", "Serious", "Critical"].map((condition) => (
                  <label key={condition} style={{ display: "flex", alignItems: "center", gap: "0.5rem", cursor: "pointer" }}>
                    <input
                      type="radio"
                      name="condition"
                      value={condition}
                      checked={formData.condition === condition}
                      onChange={(e) => setFormData({ ...formData, condition: e.target.value })}
                      style={{ cursor: "pointer" }}
                    />
                    <span style={{ 
                      padding: "0.25rem 0.75rem", 
                      borderRadius: "1rem", 
                      fontSize: "0.875rem",
                      backgroundColor: condition === "Stable" ? "#dcfce7" : condition === "Serious" ? "#fed7aa" : "#fecaca",
                      color: condition === "Stable" ? "#166534" : condition === "Serious" ? "#9a3412" : "#991b1b"
                    }}>
                      {condition}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            <div style={{ marginBottom: "1.5rem" }}>
              <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: "600" }}>
                Additional Notes
              </label>
              <textarea
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                rows={4}
                placeholder="Enter any special requirements, allergies, or important notes..."
                style={{ 
                  width: "100%", 
                  padding: "0.75rem", 
                  border: "1px solid #d1d5db", 
                  borderRadius: "0.5rem",
                  fontSize: "0.875rem"
                }}
              />
            </div>

            <div style={{ display: "flex", gap: "1rem", justifyContent: "flex-end" }}>
              <Button type="button" variant="secondary" onClick={() => navigate("/hospital/wards")}>
                Cancel
              </Button>
              <Button type="submit" disabled={loading}>
                {loading ? "Allocating..." : "Allocate Bed"}
              </Button>
            </div>
          </form>
        </Card>

        <div>
          {selectedWard && (
            <Card style={{ marginBottom: "1rem" }}>
              <h4 style={{ fontSize: "1rem", fontWeight: "600", marginBottom: "1rem" }}>
                Selected Ward
              </h4>
              <div style={{ marginBottom: "0.75rem" }}>
                <div style={{ fontSize: "1.125rem", fontWeight: "600" }}>{selectedWard.name}</div>
                <Badge variant="info" style={{ marginTop: "0.25rem" }}>{selectedWard.type}</Badge>
              </div>
              <div style={{ fontSize: "0.875rem", color: "#6b7280", marginBottom: "0.5rem" }}>
                {selectedWard.floor}
              </div>
              <div style={{ 
                padding: "0.75rem", 
                backgroundColor: "#f9fafb", 
                borderRadius: "0.375rem",
                marginTop: "1rem"
              }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.5rem" }}>
                  <span style={{ fontSize: "0.875rem" }}>Total Beds:</span>
                  <span style={{ fontWeight: "600" }}>{selectedWard.totalBeds}</span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.5rem" }}>
                  <span style={{ fontSize: "0.875rem" }}>Available:</span>
                  <span style={{ fontWeight: "600", color: "#10b981" }}>{selectedWard.availableBeds}</span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <span style={{ fontSize: "0.875rem" }}>Occupied:</span>
                  <span style={{ fontWeight: "600", color: "#ef4444" }}>{selectedWard.occupiedBeds}</span>
                </div>
              </div>
            </Card>
          )}

          {selectedPatient && (
            <Card>
              <h4 style={{ fontSize: "1rem", fontWeight: "600", marginBottom: "1rem" }}>
                Selected Patient
              </h4>
              <div style={{ marginBottom: "0.5rem" }}>
                <div style={{ fontSize: "1.125rem", fontWeight: "600" }}>
                  {selectedPatient.fullName || selectedPatient.name}
                </div>
              </div>
              <div style={{ fontSize: "0.875rem", color: "#6b7280", marginBottom: "0.25rem" }}>
                MRN: {selectedPatient.mrn || selectedPatient.id}
              </div>
              <div style={{ fontSize: "0.875rem", color: "#6b7280", marginBottom: "0.25rem" }}>
                Age: {selectedPatient.age} years
              </div>
              <div style={{ fontSize: "0.875rem", color: "#6b7280" }}>
                Gender: {selectedPatient.gender}
              </div>
            </Card>
          )}
        </div>
      </div>
    </>
  );
}
