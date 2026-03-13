import React, { useState, useEffect } from "react";
import PageHeader from "../../../components/hospital/PageHeader";
import Card from "../../../components/hospital/card";
import Button from "../../../components/hospital/Button";
import DataTable from "../../../components/hospital/DataTable";
import Modal from "../../../components/hospital/Modal";
import { Form, Input, Select, TextArea } from "../../../components/hospital/Form";
import hospitalService from "../../../services/hospitalService";

export default function InsuranceProviderManagement() {
  const [providers, setProviders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingProvider, setEditingProvider] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    loadProviders();
  }, []);

  const loadProviders = async () => {
    try {
      setLoading(true);
      const data = await hospitalService.getInsuranceProviders();
      setProviders(data);
    } catch (error) {
      console.error('Error loading insurance providers:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (values) => {
    try {
      if (editingProvider) {
        await hospitalService.updateInsuranceProvider(editingProvider.id, values);
      } else {
        await hospitalService.createInsuranceProvider(values);
      }
      await loadProviders();
      setShowModal(false);
      setEditingProvider(null);
    } catch (error) {
      console.error('Error saving insurance provider:', error);
      alert('Failed to save insurance provider. Please try again.');
    }
  };

  const handleEdit = (provider) => {
    setEditingProvider(provider);
    setShowModal(true);
  };

  const handleDelete = async (provider) => {
    if (window.confirm(`Are you sure you want to delete ${provider.name}?`)) {
      try {
        await hospitalService.deleteInsuranceProvider(provider.id);
        await loadProviders();
      } catch (error) {
        console.error('Error deleting insurance provider:', error);
        alert('Failed to delete insurance provider. Please try again.');
      }
    }
  };

  const filteredProviders = providers.filter(provider =>
    provider.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    provider.code?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    provider.type?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const columns = [
    {
      key: "name",
      label: "Provider Name",
      render: (value, row) => (
        <div>
          <div className="font-semibold">{value}</div>
          <div className="text-sm text-gray-500">Code: {row.code}</div>
        </div>
      ),
    },
    {
      key: "type",
      label: "Type",
      render: (value) => (
        <span className={`inline-block px-2 py-1 rounded text-sm font-medium ${
          value === 'Government' ? 'bg-blue-100 text-blue-800' :
          value === 'Private' ? 'bg-green-100 text-green-800' :
          value === 'HMO' ? 'bg-purple-100 text-purple-800' :
          value === 'PPO' ? 'bg-orange-100 text-orange-800' :
          'bg-gray-100 text-gray-800'
        }`}>
          {value}
        </span>
      ),
    },
    {
      key: "contactPhone",
      label: "Contact",
      render: (value, row) => (
        <div className="text-sm">
          {value && <div>{value}</div>}
          {row.contactEmail && <div className="text-gray-500">{row.contactEmail}</div>}
        </div>
      ),
    },
    {
      key: "website",
      label: "Website",
      render: (value) => value ? (
        <a href={value} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800">
          {value}
        </a>
      ) : 'N/A',
    },
    {
      key: "status",
      label: "Status",
      render: (value) => (
        <span className={`inline-block px-2 py-1 rounded text-sm font-medium ${
          value === 'Active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
        }`}>
          {value || 'Active'}
        </span>
      ),
    },
    {
      key: "actions",
      label: "Actions",
      render: (value, row) => (
        <div className="flex gap-2">
          <Button
            size="sm"
            onClick={() => handleEdit(row)}
            className="text-blue-600 hover:text-blue-800"
          >
            Edit
          </Button>
          <Button
            size="sm"
            onClick={() => handleDelete(row)}
            className="text-red-600 hover:text-red-800"
          >
            Delete
          </Button>
        </div>
      ),
    },
  ];

  return (
    <>
      <PageHeader
        title="Insurance Provider Management"
        subtitle="Manage insurance providers for patient registration"
        action={
          <Button onClick={() => setShowModal(true)}>
            + Add New Provider
          </Button>
        }
      />

      <div className="mb-6">
        <input
          type="text"
          placeholder="Search providers by name, code, or type..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full max-w-md px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>

      <Card>
        <div className="mb-4 flex justify-between items-center">
          <h2 className="text-lg font-semibold text-gray-800">
            Insurance Providers ({filteredProviders.length})
          </h2>
          <div className="text-sm text-gray-600">
            Active Providers: {providers.filter(p => p.status === 'Active').length}
          </div>
        </div>

        {loading ? (
          <div className="text-center py-8">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <p className="mt-2 text-gray-600">Loading insurance providers...</p>
          </div>
        ) : filteredProviders.length === 0 ? (
          <div className="text-center py-8">
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              {searchTerm ? "No providers found" : "No insurance providers"}
            </h3>
            <p className="text-gray-600 mb-4">
              {searchTerm 
                ? "Try adjusting your search terms" 
                : "Add your first insurance provider to get started"}
            </p>
            {!searchTerm && (
              <Button onClick={() => setShowModal(true)}>
                Add First Provider
              </Button>
            )}
          </div>
        ) : (
          <DataTable
            columns={columns}
            data={filteredProviders}
            pageSize={10}
          />
        )}
      </Card>

      {/* Add/Edit Provider Modal */}
      <Modal
        isOpen={showModal}
        onClose={() => {
          setShowModal(false);
          setEditingProvider(null);
        }}
        title={editingProvider ? "Edit Insurance Provider" : "Add New Insurance Provider"}
      >
        <Form 
          onSubmit={handleSubmit}
          initialValues={editingProvider || {}}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input name="name" label="Provider Name" required />
            <Input name="code" label="Provider Code" required />
            <Select
              name="type"
              label="Provider Type"
              options={[
                { label: "Private", value: "Private" },
                { label: "Government", value: "Government" },
                { label: "HMO", value: "HMO" },
                { label: "PPO", value: "PPO" },
                { label: "Military", value: "Military" },
              ]}
              required
            />
            <Input name="contactPhone" label="Contact Phone" />
            <Input name="contactEmail" label="Contact Email" type="email" />
            <Input name="website" label="Website" />
          </div>
          <TextArea name="address" label="Address" />
          <TextArea name="notes" label="Notes" />
        </Form>
      </Modal>
    </>
  );
}