import React, { useState } from 'react';
import FormCard from '../components/FormCard';
import { ShoppingCart, Heart, Pill, Building2 } from 'lucide-react';

const FormFieldsPage = () => {
  const [formData, setFormData] = useState({
    retail: '',
    healthcare: '',
    pharmaceutical: '',
    multiBranch: ''
  });

  const handleChange = (e, field) => {
    setFormData(prev => ({
      ...prev,
      [field]: e.target.value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-600 via-purple-600 to-blue-600 py-6 sm:py-12 px-4 sm:px-6">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-8 sm:mb-12">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-3 sm:mb-4">Service Configuration</h1>
          <p className="text-sm sm:text-base text-indigo-100">Our modular architecture allows organizations to adopt the specific modules they need with seamless integration</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
          <FormCard
            icon={ShoppingCart}
            title="Retail & Inventory Businesses"
            description="Manage product inventory, stock transactions, sales orders, purchase orders, and automated supply chain processes"
            iconBg="bg-blue-500"
            textFieldProps={{
              label: "Retail & Inventory Businesses *",
              value: formData.retail,
              onChange: (e) => handleChange(e, 'retail')
            }}
          />

          <FormCard
            icon={Heart}
            title="Healthcare Facilities"
            description="Digitize hospital and clinic operations including patient records, appointment scheduling, laboratory management, and billing"
            iconBg="bg-green-500"
            textFieldProps={{
              label: "Healthcare Facilities *",
              value: formData.healthcare,
              onChange: (e) => handleChange(e, 'healthcare')
            }}
          />

          <FormCard
            icon={Pill}
            title="Pharmaceutical Businesses"
            description="Manage regulatory compliance, prescription management, drug inventory, and customer service operations efficiently"
            iconBg="bg-orange-500"
            textFieldProps={{
              label: "Pharmaceutical Businesses *",
              value: formData.pharmaceutical,
              onChange: (e) => handleChange(e, 'pharmaceutical')
            }}
          />

          <FormCard
            icon={Building2}
            title="Multi-Branch Organizations"
            description="Monitor and manage operations across multiple locations with centralized reporting, unified accounting, and standardized reporting"
            iconBg="bg-purple-500"
            textFieldProps={{
              label: "Multi-Branch Organizations *",
              value: formData.multiBranch,
              onChange: (e) => handleChange(e, 'multiBranch')
            }}
          />

          <button
            type="submit"
            className="w-full bg-white text-indigo-600 font-semibold py-3 rounded-lg hover:bg-indigo-50 transition-colors mt-6 sm:mt-8"
          >
            Submit Configuration
          </button>
        </form>
      </div>
    </div>
  );
};

export default FormFieldsPage;
