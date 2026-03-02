import React from "react";
import { useBilling } from "../../hooks/useBilling";
import Card from "../../components/hospital/card";

const RevenueStatistics = () => {
  const { bills } = useBilling();

  const data = bills?.slice(0, 7).map((bill) => ({
    date: bill.date || 'N/A',
    revenue: bill.amount || 0,
  })) || [];

  const maxRevenue = Math.max(...data.map(d => d.revenue), 1);
  const totalRevenue = data.reduce((sum, d) => sum + d.revenue, 0);

  return (
    <Card title="Revenue Trend" subtitle={`Total: $${totalRevenue.toFixed(2)}`}>
      <div className="space-y-3">
        {data.map((item, index) => {
          const percent = (item.revenue / maxRevenue) * 100;
          return (
            <div key={index}>
              <div className="flex justify-between text-sm font-medium mb-1">
                <span>{item.date}</span>
                <span>${item.revenue.toFixed(2)}</span>
              </div>
              <div className="w-full bg-gray-200 rounded h-2">
                <div
                  className="bg-green-600 h-2 rounded"
                  style={{ width: `${percent}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </Card>
  );
};

export default RevenueStatistics;