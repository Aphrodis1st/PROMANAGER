import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import PageHeader from "../../../components/hospital/PageHeader";
import Card from "../../../components/hospital/card";
import Input from "../../../components/hospital/Input";
import Select from "../../../components/hospital/Select";
import TextArea from "../../../components/hospital/TextArea";
import Button from "../../../components/hospital/Button";
import { useLab } from "../../../hooks/useLab";

export default function LabResultsEntry() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { test, fetchLabTestById, updateLabResults } = useLab();
  const [formData, setFormData] = useState({
    results: "",
    interpretation: "",
    status: "Completed",
    performedBy: "",
    verifiedBy: "",
    remarks: "",
  });

  useEffect(() => {
    fetchLabTestById(id);
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    await updateLabResults(id, formData);
    navigate(`/hospital/lab/results/${id}`);
  };

  return (
    <>
      <PageHeader title="Enter Lab Results" />
      <Card>
        <h3>Test Information</h3>
        <p><strong>Patient:</strong> {test?.patientName}</p>
        <p><strong>Test Type:</strong> {test?.testType}</p>
        <p><strong>Requested:</strong> {test?.requestDate}</p>
      </Card>

      <Card>
        <form onSubmit={handleSubmit}>
          <TextArea
            label="Test Results"
            value={formData.results}
            onChange={(e) => setFormData({ ...formData, results: e.target.value })}
            rows={6}
            required
          />

          <Select
            label="Interpretation"
            value={formData.interpretation}
            onChange={(e) => setFormData({ ...formData, interpretation: e.target.value })}
            required
          >
            <option value="">Select Interpretation</option>
            <option value="Normal">Normal</option>
            <option value="Abnormal">Abnormal</option>
            <option value="Critical">Critical</option>
          </Select>

          <Input
            label="Performed By"
            value={formData.performedBy}
            onChange={(e) => setFormData({ ...formData, performedBy: e.target.value })}
            required
          />

          <Input
            label="Verified By"
            value={formData.verifiedBy}
            onChange={(e) => setFormData({ ...formData, verifiedBy: e.target.value })}
            required
          />

          <TextArea
            label="Remarks"
            value={formData.remarks}
            onChange={(e) => setFormData({ ...formData, remarks: e.target.value })}
            rows={3}
          />

          <Button type="submit">Submit Results</Button>
        </form>
      </Card>
    </>
  );
}
