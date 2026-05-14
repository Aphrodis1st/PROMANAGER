import React, { useState, useEffect } from 'react';

export default function UnitsList() {
  const [units, setUnits] = useState([]);
  const [properties, setProperties] = useState([]);
  const [filter, setFilter] = useState('all');
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    unitNumber: '',
    propertyId: '',
    rentPrice: '',
    size: '',
    status: 'vacant',
    bedrooms: '',
    bathrooms: ''
  });

  useEffect(() => {
    fetchUnits();
    fetchProperties();
  }, [filter]);

  const fetchProperties = async () => {
    try {
      const response = await fetch('http://localhost:3001/api/v1/property/properties');
      const data = await response.json();
      setProperties(data);
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const fetchUnits = async () => {
    try {
      const url = filter === 'all' 
        ? 'http://localhost:3001/api/v1/property/units'
        : `http://localhost:3001/api/v1/property/units?status=${filter}`;
      const response = await fetch(url);
      const data = await response.json();
      setUnits(data);
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const property = properties.find(p => p.id === formData.propertyId);
    const unitData = {
      ...formData,
      propertyName: property?.name || '',
      propertyAddress: property?.address || ''
    };
    try {
      const response = await fetch('http://localhost:3001/api/v1/property/units', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(unitData)
      });
      if (response.ok) {
        setShowForm(false);
        setFormData({ unitNumber: '', propertyId: '', rentPrice: '', size: '', status: 'vacant', bedrooms: '', bathrooms: '' });
        fetchUnits();
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      vacant: 'bg-green-100 text-green-800',
      occupied: 'bg-blue-100 text-blue-800',
      maintenance: 'bg-yellow-100 text-yellow-800',
      reserved: 'bg-purple-100 text-purple-800'
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Units / Rooms</h1>
        <div className="flex gap-4">
          <button className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600">
            Bulk Import
          </button>
          <button onClick={() => setShowForm(!showForm)} className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
            Add Unit
          </button>
        </div>
      </div>

      {showForm && (
        <div className="bg-white p-6 rounded-lg shadow mb-6">
          <h2 className="text-xl font-bold mb-4">Add New Unit</h2>
          <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-4">
            <select
              value={formData.propertyId}
              onChange={(e) => setFormData({...formData, propertyId: e.target.value})}
              className="border p-2 rounded col-span-2"
              required
            >
              <option value="">Select Property</option>
              {properties.map(p => (
                <option key={p.id} value={p.id}>{p.name} - {p.address}</option>
              ))}
            </select>
            <input
              type="text"
              placeholder="Unit Number (e.g., 101, A-5)"
              value={formData.unitNumber}
              onChange={(e) => setFormData({...formData, unitNumber: e.target.value})}
              className="border p-2 rounded"
              required
            />
            <input
              type="number"
              placeholder="Rent Price"
              value={formData.rentPrice}
              onChange={(e) => setFormData({...formData, rentPrice: e.target.value})}
              className="border p-2 rounded"
              required
            />
            <input
              type="number"
              placeholder="Size (sqft)"
              value={formData.size}
              onChange={(e) => setFormData({...formData, size: e.target.value})}
              className="border p-2 rounded"
              required
            />
            <input
              type="number"
              placeholder="Bedrooms"
              value={formData.bedrooms}
              onChange={(e) => setFormData({...formData, bedrooms: e.target.value})}
              className="border p-2 rounded"
            />
            <input
              type="number"
              placeholder="Bathrooms"
              value={formData.bathrooms}
              onChange={(e) => setFormData({...formData, bathrooms: e.target.value})}
              className="border p-2 rounded"
            />
            <select
              value={formData.status}
              onChange={(e) => setFormData({...formData, status: e.target.value})}
              className="border p-2 rounded"
            >
              <option value="vacant">Vacant</option>
              <option value="occupied">Occupied</option>
              <option value="maintenance">Maintenance</option>
              <option value="reserved">Reserved</option>
            </select>
            <div className="flex gap-2 col-span-2">
              <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
                Save
              </button>
              <button type="button" onClick={() => setShowForm(false)} className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600">
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="mb-4 flex gap-2">
        <button onClick={() => setFilter('all')} className={`px-4 py-2 rounded ${filter === 'all' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}>All</button>
        <button onClick={() => setFilter('vacant')} className={`px-4 py-2 rounded ${filter === 'vacant' ? 'bg-green-500 text-white' : 'bg-gray-200'}`}>Vacant</button>
        <button onClick={() => setFilter('occupied')} className={`px-4 py-2 rounded ${filter === 'occupied' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}>Occupied</button>
        <button onClick={() => setFilter('maintenance')} className={`px-4 py-2 rounded ${filter === 'maintenance' ? 'bg-yellow-500 text-white' : 'bg-gray-200'}`}>Maintenance</button>
      </div>

      {units.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-lg shadow">
          <p className="text-gray-500 text-lg">No units found. Click "Add Unit" to create one.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {units.map((unit) => (
            <div key={unit.id} className="bg-white p-6 rounded-lg shadow">
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-xl font-bold">{unit.unitNumber}</h3>
                <span className={`px-2 py-1 rounded text-xs ${getStatusColor(unit.status)}`}>
                  {unit.status}
                </span>
              </div>
              <p className="text-gray-600 mb-2">Property: {unit.propertyName}</p>
              {unit.propertyAddress && <p className="text-gray-500 text-sm mb-2">{unit.propertyAddress}</p>}
              <p className="text-gray-600 mb-2">Rent: ${unit.rentPrice}/month</p>
              <p className="text-gray-600 mb-2">Size: {unit.size} sqft</p>
              {unit.bedrooms && <p className="text-gray-600 mb-2">{unit.bedrooms} bed, {unit.bathrooms} bath</p>}
              <div className="flex gap-2">
                <button className="text-blue-600 hover:underline">View</button>
                <button className="text-green-600 hover:underline">Edit</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
