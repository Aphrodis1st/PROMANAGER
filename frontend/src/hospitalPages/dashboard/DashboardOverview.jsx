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
import { useHospitalAuth } from "../../context/HospitalAuthContext";

const DashboardOverview = () => {
  const navigate = useNavigate();
  const { hospital, admin } = useHospitalAuth();
  const { patients } = usePatients();
  const { appointments } = useAppointments();
  const { bills } = useBilling();

  const totalRevenue = bills?.reduce((sum, b) => sum + (b.amount || 0), 0);

  return (
    <div className="space-y-6">
      {/* Hospital Banner */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 rounded-xl p-6 text-white flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">{hospital?.name || 'Hospital Dashboard'}</h1>
          <p className="text-blue-200 text-sm mt-1">
            {hospital?.location && <span className="mr-3">📍 {hospital.location}</span>}
            {hospital?.subscriptionPlan && (
              <span className="capitalize bg-white/20 px-2 py-0.5 rounded-full text-xs font-semibold">
                {hospital.subscriptionPlan}
              </span>
            )}
          </p>
          {admin?.email && (
            <p className="text-blue-300 text-xs mt-2">Logged in as: {admin.email}</p>
          )}
        </div>
        <Button onClick={() => navigate("/hospital/reports")}>📊 View Reports</Button>
      </div>

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
