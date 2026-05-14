import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { ArrowLeft, Edit, Trash2, Building2, MapPin, Calendar, Home, DollarSign, Users, Key } from 'lucide-react';

export default function PropertyDetails() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [property, setProperty] = useState(null);
  const [units, setUnits] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProperty();
    fetchUnits();
  }, [id]);

  const fetchProperty = async () => {
    try {
      const response = await fetch(`http://localhost:3001/api/v1/property/properties/${id}`);
      const data = await response.json();
      setProperty(data);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchUnits = async () => {
    try {
      const response = await fetch(`http://localhost:3001/api/v1/property/units?propertyId=${id}`);
      const data = await response.json();
      setUnits(data);
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const handleDelete = async () => {
    if (!confirm('Delete this property? This will also delete all associated units.')) return;
    try {
      await fetch(`http://localhost:3001/api/v1/property/properties/${id}`, { method: 'DELETE' });
      navigate('/property/properties');
    } catch (error) {
      console.error('Error:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!property) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Property Not Found</h2>
          <button onClick={() => navigate('/property/properties')} className="text-blue-600 hover:underline">
            Back to Properties
          </button>
        </div>
      </div>
    );
  }

  const stats = {
    totalUnits: units.length,
    occupied: units.filter(u => u.status === 'occupied').length,
    vacant: units.filter(u => u.status === 'vacant').length,
    maintenance: units.filter(u => u.status === 'maintenance').length
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <button
            onClick={() => navigate('/property/properties')}
            className="flex items-center text-gray-600 hover:text-gray-900 mb-4"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Back to Properties
          </button>
          
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 mb-2">{property.name}</h1>
              <div className="flex items-center text-gray-600">
                <MapPin className="w-5 h-5 mr-2" />
                <p>{property.address}{property.city && `, ${property.city}`}{property.state && `, ${property.state}`} {property.zipCode}</p>
              </div>
            </div>
            <div className="flex gap-3">
              <Link
                to={`/property/properties/${id}/edit`}
                className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
              >
                <Edit className="w-4 h-4" />
                Edit
              </Link>
              <button
                onClick={handleDelete}
                className="flex items-center gap-2 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700"
              >
                <Trash2 className="w-4 h-4" />
                Delete
              </button>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-blue-100 rounded-lg">
                <Key className="w-6 h-6 text-blue-600" />
              </div>
            </div>
            <p className="text-3xl font-bold text-gray-900">{stats.totalUnits}</p>
            <p className="text-sm text-gray-600">Total Units</p>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-green-100 rounded-lg">
                <Users className="w-6 h-6 text-green-600" />
              </div>
            </div>
            <p className="text-3xl font-bold text-gray-900">{stats.occupied}</p>
            <p className="text-sm text-gray-600">Occupied</p>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-purple-100 rounded-lg">
                <Home className="w-6 h-6 text-purple-600" />
              </div>
            </div>
            <p className="text-3xl font-bold text-gray-900">{stats.vacant}</p>
            <p className="text-sm text-gray-600">Vacant</p>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-yellow-100 rounded-lg">
                <Building2 className="w-6 h-6 text-yellow-600" />
              </div>
            </div>
            <p className="text-3xl font-bold text-gray-900">{stats.maintenance}</p>
            <p className="text-sm text-gray-600">Maintenance</p>
          </div>
        </div>

        {/* Property Details */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          <div className="lg:col-span-2 bg-white rounded-xl shadow-sm p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Property Information</h2>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-600">Property Type</p>
                <p className="font-semibold text-gray-900">{property.type}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Status</p>
                <span className={`inline-block px-3 py-1 rounded-full text-sm font-semibold ${
                  property.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                }`}>
                  {property.status}
                </span>
              </div>
              {property.yearBuilt && (
                <div>
                  <p className="text-sm text-gray-600">Year Built</p>
                  <p className="font-semibold text-gray-900">{property.yearBuilt}</p>
                </div>
              )}
              {property.squareFeet && (
                <div>
                  <p className="text-sm text-gray-600">Square Feet</p>
                  <p className="font-semibold text-gray-900">{property.squareFeet} sqft</p>
                </div>
              )}
              {property.lotSize && (
                <div>
                  <p className="text-sm text-gray-600">Lot Size</p>
                  <p className="font-semibold text-gray-900">{property.lotSize} acres</p>
                </div>
              )}
            </div>
            
            {property.description && (
              <div className="mt-6">
                <p className="text-sm text-gray-600 mb-2">Description</p>
                <p className="text-gray-900">{property.description}</p>
              </div>
            )}
            
            {property.amenities && (
              <div className="mt-6">
                <p className="text-sm text-gray-600 mb-2">Amenities</p>
                <p className="text-gray-900">{property.amenities}</p>
              </div>
            )}
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Location</h2>
            <div className="space-y-3">
              <div>
                <p className="text-sm text-gray-600">Address</p>
                <p className="font-semibold text-gray-900">{property.address}</p>
              </div>
              {property.city && (
                <div>
                  <p className="text-sm text-gray-600">City</p>
                  <p className="font-semibold text-gray-900">{property.city}</p>
                </div>
              )}
              {property.state && (
                <div>
                  <p className="text-sm text-gray-600">State</p>
                  <p className="font-semibold text-gray-900">{property.state}</p>
                </div>
              )}
              {property.zipCode && (
                <div>
                  <p className="text-sm text-gray-600">ZIP Code</p>
                  <p className="font-semibold text-gray-900">{property.zipCode}</p>
                </div>
              )}
              {property.country && (
                <div>
                  <p className="text-sm text-gray-600">Country</p>
                  <p className="font-semibold text-gray-900">{property.country}</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Units List */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Units</h2>
          {units.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              No units found for this property
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {units.map((unit) => (
                <div key={unit.id} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex justify-between items-start mb-3">
                    <h3 className="text-lg font-bold text-gray-900">{unit.unitNumber}</h3>
                    <span className={`px-2 py-1 rounded text-xs font-semibold ${
                      unit.status === 'vacant' ? 'bg-green-100 text-green-800' :
                      unit.status === 'occupied' ? 'bg-blue-100 text-blue-800' :
                      unit.status === 'maintenance' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-purple-100 text-purple-800'
                    }`}>
                      {unit.status}
                    </span>
                  </div>
                  {unit.floor && <p className="text-sm text-gray-600">Floor: {unit.floor}</p>}
                  {unit.bedrooms && <p className="text-sm text-gray-600">{unit.bedrooms} bed, {unit.bathrooms} bath</p>}
                  {unit.size && <p className="text-sm text-gray-600">{unit.size} sqft</p>}
                  {unit.rentPrice && <p className="text-sm font-semibold text-gray-900 mt-2">${unit.rentPrice}/month</p>}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
