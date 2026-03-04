import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import PageHeader from "../../../components/hospital/PageHeader";
import Card from "../../../components/hospital/card";
import { Form, Select, TextArea } from "../../../components/hospital/Form";
import { useLab } from "../../../hooks/useLab";

export default function LabOrderCreate() {
  const { patientId } = useParams();
  const navigate = useNavigate();
  const { createLabOrder } = useLab();
  const [loading, setLoading] = useState(false);
  const [selectedTests, setSelectedTests] = useState([]);

  const availableTests = [
    { label: "Complete Blood Count (CBC)", value: "CBC" },
    { label: "Blood Glucose", value: "Blood Glucose" },
    { label: "Lipid Profile", value: "Lipid Profile" },
    { label: "Liver Function Test (LFT)", value: "LFT" },
    { label: "Kidney Function Test (KFT)", value: "KFT" },
    { label: "Thyroid Function Test (TFT)", value: "TFT" },
    { label: "Urinalysis", value: "Urinalysis" },
    { label: "HbA1c", value: "HbA1c" },
    { label: "C-Reactive Protein (CRP)", value: "CRP" },
    { label: "Electrolytes", value: "Electrolytes" },
  ];

  const handleSubmit = async (values) => {
    setLoading(true);
    try {
      await createLabOrder({
        ...values,
        patientId,
        tests: selectedTests,
        status: "Pending",
      });
      alert("Lab order created successfully!");
      navigate(`/hospital/medical-records/${patientId}`);
    } catch (error) {
      console.error("Error creating lab order:", error);
      alert("Failed to create lab order. Please try again.");
      setLoading(false);
    }
  };

  return (
    <>
      <PageHeader title="Order Laboratory Tests" />
      <Card>
        {loading ? (
          <div style={{ textAlign: "center", padding: "2rem" }}>Creating lab order...</div>
        ) : (
          <Form onSubmit={handleSubmit}>
            <div>
              <label style={{ display: "block", marginBottom: "0.5rem", fontSize: "0.875rem" }}>
                Select Tests *
              </label>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "0.5rem", marginBottom: "1rem" }}>
                {availableTests.map((test) => (
                  <label key={test.value} style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                    <input
                      type="checkbox"
                      checked={selectedTests.includes(test.value)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSelectedTests([...selectedTests, test.value]);
                        } else {
                          setSelectedTests(selectedTests.filter(t => t !== test.value));
                        }
                      }}
                    />
                    {test.label}
                  </label>
                ))}
              </div>
            </div>
            <Select
              name="priority"
              label="Priority"
              options={[
                { label: "Routine", value: "Routine" },
                { label: "Urgent", value: "Urgent" },
                { label: "STAT (Immediate)", value: "STAT" },
              ]}
              required
            />
            <TextArea name="clinicalNotes" label="Clinical Notes / Indication" />
          </Form>
        )}
      </Card>
    </>
  );
}
