import React from 'react';
import { 
  XMarkIcon,
  DocumentArrowDownIcon,
  PrinterIcon,
  CalendarIcon,
  UserIcon,
  BanknotesIcon
} from '@heroicons/react/24/outline';

const PayrollDetailsModal = ({ payroll, employee, isOpen, onClose }) => {
  if (!isOpen || !payroll) return null;

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount || 0);
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const handlePrint = () => {
    window.print();
  };

  const handleDownload = () => {
    // Create a simple payslip content
    const payslipContent = `
      PAYSLIP
      -------
      Employee: ${employee?.firstName} ${employee?.lastName}
      Employee ID: ${payroll.employeeId}
      Period: ${months[payroll.month - 1]} ${payroll.year}
      
      EARNINGS:
      Base Salary: ${formatCurrency(payroll.baseSalary)}
      Allowances: ${formatCurrency(payroll.allowances)}
      Overtime: ${formatCurrency(payroll.overtime)}
      
      DEDUCTIONS:
      Tax: ${formatCurrency(payroll.tax)}
      Other Deductions: ${formatCurrency(payroll.deductions)}
      
      NET SALARY: ${formatCurrency(payroll.netSalary)}
      
      Generated on: ${formatDate(payroll.createdAt)}
    `;

    const blob = new Blob([payslipContent], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `payslip-${payroll.employeeId}-${payroll.month}-${payroll.year}.txt`;
    a.click();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">Payroll Details</h2>
            <p className="text-sm text-gray-600">
              {months[payroll.month - 1]} {payroll.year} - {payroll.employeeId}
            </p>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={handlePrint}
              className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
              title="Print"
            >
              <PrinterIcon className="w-5 h-5" />
            </button>
            <button
              onClick={handleDownload}
              className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
              title="Download"
            >
              <DocumentArrowDownIcon className="w-5 h-5" />
            </button>
            <button
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
            >
              <XMarkIcon className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Employee Info */}
          <div className="bg-gray-50 rounded-lg p-4 mb-6">
            <div className="flex items-center mb-3">
              <UserIcon className="w-5 h-5 text-gray-600 mr-2" />
              <h3 className="font-medium text-gray-900">Employee Information</h3>
            </div>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-gray-600">Name:</span>
                <span className="ml-2 font-medium">
                  {employee?.firstName} {employee?.lastName}
                </span>
              </div>
              <div>
                <span className="text-gray-600">Employee ID:</span>
                <span className="ml-2 font-medium">{payroll.employeeId}</span>
              </div>
              <div>
                <span className="text-gray-600">Department:</span>
                <span className="ml-2 font-medium">{employee?.department || 'N/A'}</span>
              </div>
              <div>
                <span className="text-gray-600">Position:</span>
                <span className="ml-2 font-medium">{employee?.position || 'N/A'}</span>
              </div>
            </div>
          </div>

          {/* Pay Period */}
          <div className="bg-blue-50 rounded-lg p-4 mb-6">
            <div className="flex items-center mb-3">
              <CalendarIcon className="w-5 h-5 text-blue-600 mr-2" />
              <h3 className="font-medium text-gray-900">Pay Period</h3>
            </div>
            <div className="text-sm">
              <span className="text-gray-600">Period:</span>
              <span className="ml-2 font-medium">
                {months[payroll.month - 1]} {payroll.year}
              </span>
            </div>
          </div>

          {/* Earnings */}
          <div className="bg-green-50 rounded-lg p-4 mb-6">
            <div className="flex items-center mb-3">
              <BanknotesIcon className="w-5 h-5 text-green-600 mr-2" />
              <h3 className="font-medium text-gray-900">Earnings</h3>
            </div>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Base Salary:</span>
                <span className="font-medium">{formatCurrency(payroll.baseSalary)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Allowances:</span>
                <span className="font-medium">{formatCurrency(payroll.allowances)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Overtime:</span>
                <span className="font-medium">{formatCurrency(payroll.overtime)}</span>
              </div>
              <div className="border-t border-green-200 pt-2 mt-2">
                <div className="flex justify-between font-semibold">
                  <span>Gross Earnings:</span>
                  <span>{formatCurrency(
                    (payroll.baseSalary || 0) + 
                    (payroll.allowances || 0) + 
                    (payroll.overtime || 0)
                  )}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Deductions */}
          <div className="bg-red-50 rounded-lg p-4 mb-6">
            <h3 className="font-medium text-gray-900 mb-3">Deductions</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Tax:</span>
                <span className="font-medium text-red-600">{formatCurrency(payroll.tax)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Other Deductions:</span>
                <span className="font-medium text-red-600">{formatCurrency(payroll.deductions)}</span>
              </div>
              <div className="border-t border-red-200 pt-2 mt-2">
                <div className="flex justify-between font-semibold">
                  <span>Total Deductions:</span>
                  <span className="text-red-600">{formatCurrency(
                    (payroll.tax || 0) + (payroll.deductions || 0)
                  )}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Net Salary */}
          <div className="bg-indigo-50 rounded-lg p-4 mb-6">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold text-gray-900">Net Salary</h3>
              <span className="text-2xl font-bold text-indigo-600">
                {formatCurrency(payroll.netSalary)}
              </span>
            </div>
          </div>

          {/* Status and Timestamps */}
          <div className="bg-gray-50 rounded-lg p-4">
            <h3 className="font-medium text-gray-900 mb-3">Status & History</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-gray-600">Status:</span>
                <span className={`ml-2 px-2 py-1 rounded-full text-xs font-medium ${
                  payroll.status === 'processed' ? 'bg-green-100 text-green-800' :
                  payroll.status === 'approved' ? 'bg-blue-100 text-blue-800' :
                  'bg-yellow-100 text-yellow-800'
                }`}>
                  {payroll.status || 'Generated'}
                </span>
              </div>
              <div>
                <span className="text-gray-600">Generated:</span>
                <span className="ml-2 font-medium">
                  {payroll.createdAt ? formatDate(payroll.createdAt) : 'N/A'}
                </span>
              </div>
              {payroll.approvedAt && (
                <div>
                  <span className="text-gray-600">Approved:</span>
                  <span className="ml-2 font-medium">{formatDate(payroll.approvedAt)}</span>
                </div>
              )}
              {payroll.processedAt && (
                <div>
                  <span className="text-gray-600">Processed:</span>
                  <span className="ml-2 font-medium">{formatDate(payroll.processedAt)}</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end space-x-3 p-6 border-t border-gray-200">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
          >
            Close
          </button>
          <button
            onClick={handleDownload}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Download Payslip
          </button>
        </div>
      </div>
    </div>
  );
};

export default PayrollDetailsModal;