import React from "react";
import { useNavigate } from "react-router-dom";
import PageHeader from "../../components/hospital/PageHeader";
import { usePatients } from "../../hooks/usePatients";
import { useAppointments } from "../../hooks/useAppointments";
import { useBilling } from "../../hooks/useBilling";
import Card from "../../components/hospital/card";
import Button from "../../components/hospital/Button";
import DepartmentStatistics from "./DepartmentStatistics";
import RevenueStatistics from "./RevenueStatistics";
import PatientFlow from "./PatientFlow";
import BedOccupancy from "./BedOccupancy";

const DashboardOverview = () => {
  const navigate = useNavigate();
  const { patients } = usePatients();
  const { appointments } = useAppointments();
  const { bills } = useBilling();

  const totalRevenue = bills?.reduce((sum, b) => sum + (b.amount || 0), 0);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Hospital Dashboard"
        subtitle="Executive overview of hospital operations"
        action={
          <Button onClick={() => navigate("/hospital/reports")}>
            📊 View All Reports
          </Button>
        }
      />

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card title="Total Patients" value={patients?.length || 0} />
        <Card title="Appointments Today" value={appointments?.length || 0} />
        <Card title="Total Revenue" value={`$${totalRevenue || 0}`} />
        <Card title="Active Admissions" value="24" />
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <DepartmentStatistics />
        <RevenueStatistics />
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <PatientFlow />
        <BedOccupancy />
      </div>
    </div>
  );
};

export default DashboardOverview;