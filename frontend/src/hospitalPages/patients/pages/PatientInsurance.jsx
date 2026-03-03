import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import PageHeader from "../../../components/hospital/PageHeader";
import Card from "../../../components/hospital/card";
import Button from "../../../components/hospital/Button";

export default function PatientInsurance() {
  const { id } = useParams();
  const navigate = useNavigate();

  const insurance = {
    provider: "Blue Cross Blue Shield",
    policyNumber: "BC123456789",
    groupNumber: "GRP-001",
    validFrom: "2024-01-01",
    validTo: "2024-12-31",
    coverageType: "Comprehensive",
  };

  return (
    <>
      <PageHeader
        title="Patient Insurance Information"
        action={
          <div className="flex gap-2">
            <Button>Edit Insurance</Button>
            <Button variant="secondary" onClick={() => navigate(`/hospital/patients/${id}`)}>
              Back
            </Button>
          </div>
        }
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card title="Insurance Details">
          <div className="space-y-3">
            <div>
              <p className="text-sm text-gray-500">Insurance Provider</p>
              <p className="font-semibold">{insurance.provider}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Policy Number</p>
              <p className="font-semibold">{insurance.policyNumber}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Group Number</p>
              <p className="font-semibold">{insurance.groupNumber}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Coverage Type</p>
              <p className="font-semibold">{insurance.coverageType}</p>
            </div>
          </div>
        </Card>

        <Card title="Validity Period">
          <div className="space-y-3">
            <div>
              <p className="text-sm text-gray-500">Valid From</p>
              <p className="font-semibold">{insurance.validFrom}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Valid To</p>
              <p className="font-semibold">{insurance.validTo}</p>
            </div>
            <div className="mt-4">
              <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm">
                Active
              </span>
            </div>
          </div>
        </Card>
      </div>
    </>
  );
}
