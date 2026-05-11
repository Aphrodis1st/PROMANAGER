import React, { useState, useEffect } from 'react';
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { TrendingUp, Package, AlertCircle, DollarSign, Eye, Download, Filter } from 'lucide-react';

const FinishedGoodsStockPage = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [stockData, setStockData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({ category: 'all', status: 'all' });
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchStockData();
  }, []);

  const fetchStockData = async () => {
    try {
      const response = await fetch('/api/finished-goods/stock');
      const data = await response.json();
      setStockData(data);
    } catch (error) {
      console.error('Error fetching stock data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getChartData = () => {
    return stockData.map(item => ({
      name: item.productName,
      quantity: item.quantity,
      value: item.quantity * item.sellingPrice,
      status: item.quantity > item.reorderLevel ? 'In Stock' : 'Low Stock'
    }));
  };

  const getCategoryData = () => {
    const categories = {};
    stockData.forEach(item => {
      categories[item.category] = (categories[item.category] || 0) + item.quantity;
    });
    return Object.entries(categories).map(([name, value]) => ({ name, value }));
  };

  const getValueData = () => {
    const categories = {};
    stockData.forEach(item => {
      const itemValue = item.quantity * item.sellingPrice;
      categories[item.category] = (categories[item.category] || 0) + itemValue;
    });
    return Object.entries(categories).map(([name, value]) => ({ name, value }));
  };

  const getTrendData = () => {
    return stockData.slice(0, 10).map(item => ({
      name: item.productName.substring(0, 10),
      current: item.quantity,
      previous: Math.max(0, item.quantity - Math.random() * 20)
    }));
  };

  const stats = {
    totalProducts: stockData.length,
    totalValue: stockData.reduce((sum, item) => sum + (item.quantity * item.sellingPrice), 0),
    lowStockItems: stockData.filter(item => item.quantity <= item.reorderLevel).length,
    avgTurnover: (stockData.reduce((sum, item) => sum + item.turnoverRate, 0) / stockData.length).toFixed(2)
  };

  const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899'];

  const StatCard = ({ icon: Icon, label, value, color }) => (
    <div className="bg-white rounded-lg shadow p-6 border-l-4" style={{ borderColor: color }}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-gray-600 text-sm font-medium">{label}</p>
          <p className="text-2xl font-bold text-gray-900 mt-2">{value}</p>
        </div>
        <Icon className="w-10 h-10" style={{ color }} />
      </div>
    </div>
  );

  const TabButton = ({ id, label }) => (
    <button
      onClick={() => setActiveTab(id)}
      className={`px-4 py-2 font-medium rounded-lg transition ${
        activeTab === id
          ? 'bg-blue-600 text-white'
          : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
      }`}
    >
      {label}
    </button>
  );

  if (loading) {
    return <div className="flex items-center justify-center h-screen">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Finished Goods Stock Dashboard</h1>
          <p className="text-gray-600 mt-2">Real-time inventory analytics and insights</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <StatCard icon={Package} label="Total Products" value={stats.totalProducts} color="#3b82f6" />
          <StatCard icon={DollarSign} label="Total Value" value={`$${(stats.totalValue / 1000).toFixed(1)}K`} color="#10b981" />
          <StatCard icon={AlertCircle} label="Low Stock Items" value={stats.lowStockItems} color="#ef4444" />
          <StatCard icon={TrendingUp} label="Avg Turnover" value={`${stats.avgTurnover}x`} color="#f59e0b" />
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow p-4 mb-8 flex gap-4 items-center">
          <Filter className="w-5 h-5 text-gray-600" />
          <input
            type="text"
            placeholder="Search products..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <select
            value={filters.category}
            onChange={(e) => setFilters({ ...filters, category: e.target.value })}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">All Categories</option>
            {[...new Set(stockData.map(item => item.category))].map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
          <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center gap-2">
            <Download className="w-4 h-4" />
            Export
          </button>
        </div>

        {/* Tabs */}
        <div className="flex gap-4 mb-8 bg-white rounded-lg shadow p-4">
          <TabButton id="overview" label="Overview" />
          <TabButton id="analytics" label="Analytics" />
          <TabButton id="inventory" label="Inventory" />
          <TabButton id="performance" label="Performance" />
        </div>

        {/* Tab Content */}
        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-lg font-bold text-gray-900 mb-4">Stock Levels by Product</h2>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={getChartData()}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" angle={-45} textAnchor="end" height={80} />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="quantity" fill="#3b82f6" />
                </BarChart>
              </ResponsiveContainer>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-lg font-bold text-gray-900 mb-4">Stock Distribution by Category</h2>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie data={getCategoryData()} cx="50%" cy="50%" labelLine={false} label={({ name, value }) => `${name}: ${value}`} outerRadius={80} fill="#8884d8" dataKey="value">
                    {getCategoryData().map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}

        {activeTab === 'analytics' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-lg font-bold text-gray-900 mb-4">Inventory Value by Category</h2>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={getValueData()}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip formatter={(value) => `$${value.toFixed(2)}`} />
                  <Bar dataKey="value" fill="#10b981" />
                </BarChart>
              </ResponsiveContainer>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-lg font-bold text-gray-900 mb-4">Stock Trend Analysis</h2>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={getTrendData()}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="current" stroke="#3b82f6" strokeWidth={2} />
                  <Line type="monotone" dataKey="previous" stroke="#cbd5e1" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}

        {activeTab === 'inventory' && (
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-100 border-b">
                <tr>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Product</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Category</th>
                  <th className="px-6 py-3 text-right text-sm font-semibold text-gray-900">Quantity</th>
                  <th className="px-6 py-3 text-right text-sm font-semibold text-gray-900">Unit Price</th>
                  <th className="px-6 py-3 text-right text-sm font-semibold text-gray-900">Total Value</th>
                  <th className="px-6 py-3 text-center text-sm font-semibold text-gray-900">Status</th>
                </tr>
              </thead>
              <tbody>
                {stockData.filter(item => 
                  item.productName.toLowerCase().includes(searchTerm.toLowerCase()) &&
                  (filters.category === 'all' || item.category === filters.category)
                ).map((item, idx) => (
                  <tr key={idx} className="border-b hover:bg-gray-50">
                    <td className="px-6 py-4 text-sm text-gray-900">{item.productName}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">{item.category}</td>
                    <td className="px-6 py-4 text-sm text-right text-gray-900 font-medium">{item.quantity}</td>
                    <td className="px-6 py-4 text-sm text-right text-gray-600">${item.sellingPrice.toFixed(2)}</td>
                    <td className="px-6 py-4 text-sm text-right text-gray-900 font-medium">${(item.quantity * item.sellingPrice).toFixed(2)}</td>
                    <td className="px-6 py-4 text-center">
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        item.quantity > item.reorderLevel
                          ? 'bg-green-100 text-green-800'
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {item.quantity > item.reorderLevel ? 'In Stock' : 'Low Stock'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {activeTab === 'performance' && (
          <div className="grid grid-cols-1 gap-8">
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-lg font-bold text-gray-900 mb-4">Top Performing Products</h2>
              <div className="space-y-4">
                {stockData.sort((a, b) => (b.quantity * b.sellingPrice) - (a.quantity * a.sellingPrice)).slice(0, 5).map((item, idx) => (
                  <div key={idx} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                        <span className="text-blue-600 font-bold">{idx + 1}</span>
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900">{item.productName}</p>
                        <p className="text-sm text-gray-600">{item.category}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-gray-900">${(item.quantity * item.sellingPrice).toFixed(2)}</p>
                      <p className="text-sm text-gray-600">{item.quantity} units</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-lg font-bold text-gray-900 mb-4">Critical Stock Alerts</h2>
              <div className="space-y-3">
                {stockData.filter(item => item.quantity <= item.reorderLevel).map((item, idx) => (
                  <div key={idx} className="flex items-center gap-4 p-4 bg-red-50 border border-red-200 rounded-lg">
                    <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
                    <div className="flex-1">
                      <p className="font-semibold text-gray-900">{item.productName}</p>
                      <p className="text-sm text-gray-600">Current: {item.quantity} units | Reorder Level: {item.reorderLevel}</p>
                    </div>
                    <button className="px-3 py-1 bg-red-600 text-white rounded text-sm hover:bg-red-700">
                      Reorder
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default FinishedGoodsStockPage;
