import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Search, Plus, Eye, Edit, Trash2, TrendingUp, Award, Target, BarChart3, Star, Calendar, Filter, Download, Users } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Performance = () => {
  const [reviews, setReviews] = useState([]);
  const [filteredReviews, setFilteredReviews] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [periodFilter, setPeriodFilter] = useState('all');
  const [ratingFilter, setRatingFilter] = useState('all');
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState('add');
  const [selectedReview, setSelectedReview] = useState(null);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    employeeId: '',
    employeeName: '',
    reviewPeriod: '',
    reviewDate: '',
    reviewer: '',
    overallRating: 5,
    productivity: 5,
    quality: 5,
    communication: 5,
    teamwork: 5,
    initiative: 5,
    strengths: '',
    improvements: '',
    goals: '',
    comments: ''
  });
  
  // Use hospital auth context
  const { user } = useAuth();
  const organizationId = user?.hospitalId;

  useEffect(() => {
    if (organizationId) {
      loadReviews();
    } else {
      setLoading(false);
    }
  }, [organizationId]);

  useEffect(() => {
    filterReviews();
  }, [reviews, searchTerm, periodFilter, ratingFilter]);

  const loadReviews = () => {
    setLoading(true);
    axios.get(`/api/v1/hr/performance?organizationId=${organizationId}`)
      .then(res => {
        setReviews(res.data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  };

  if (!organizationId) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 p-6 flex items-center justify-center">
        <div className="bg-white rounded-xl shadow-lg border border-slate-200 p-8 max-w-md text-center">
          <TrendingUp className="w-16 h-16 text-purple-600 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-slate-800 mb-2">Organization Access Required</h2>
          <p className="text-slate-600 mb-6">Please log in to access Performance Management.</p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 p-6 flex items-center justify-center">
        <div className="bg-white rounded-xl shadow-lg border border-slate-200 p-8 max-w-md text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-slate-600">Loading performance reviews...</p>
        </div>
      </div>
    );
  }

  const filterReviews = () => {
    let filtered = reviews;
    if (searchTerm) {
      filtered = filtered.filter(r => 
        r.employeeName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        r.reviewer?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    if (periodFilter !== 'all') filtered = filtered.filter(r => r.reviewPeriod === periodFilter);
    if (ratingFilter !== 'all') {
      const [min, max] = ratingFilter.split('-').map(Number);
      filtered = filtered.filter(r => r.overallRating >= min && r.overallRating <= max);
    }
    setFilteredReviews(filtered);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const payload = { ...formData, organizationId };
    const request = modalMode === 'add' 
      ? axios.post('/api/v1/hr/performance', payload)
      : axios.put(`/api/v1/hr/performance/${selectedReview.id}`, payload);
    
    request.then(() => {
      loadReviews();
      closeModal();
    }).catch(err => console.error(err));
  };

  const handleDelete = (id) => {
    if (confirm('Delete this performance review?')) {
      axios.delete(`/api/v1/hr/performance/${id}`).then(() => loadReviews());
    }
  };

  const openModal = (mode, review = null) => {
    setModalMode(mode);
    setSelectedReview(review);
    if (review) setFormData(review);
    else setFormData({ employeeId: '', employeeName: '', reviewPeriod: '', reviewDate: '', reviewer: '', overallRating: 5, productivity: 5, quality: 5, communication: 5, teamwork: 5, initiative: 5, strengths: '', improvements: '', goals: '', comments: '' });
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedReview(null);
  };

  const getRatingColor = (rating) => {
    if (rating >= 4.5) return 'text-green-600 bg-green-100';
    if (rating >= 3.5) return 'text-blue-600 bg-blue-100';
    if (rating >= 2.5) return 'text-yellow-600 bg-yellow-100';
    return 'text-red-600 bg-red-100';
  };

  const getRatingStars = (rating) => {
    return Array(5).fill(0).map((_, i) => (
      <Star key={i} className={`w-4 h-4 ${i < rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`} />
    ));
  };

  const avgRating = reviews.length > 0 ? (reviews.reduce((sum, r) => sum + r.overallRating, 0) / reviews.length).toFixed(1) : 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 mb-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-slate-800 flex items-center gap-3">
                <TrendingUp className="w-8 h-8 text-purple-600" />
                Performance Management
              </h1>
              <p className="text-slate-600 mt-1">Track and evaluate employee performance</p>
            </div>
            <button onClick={() => openModal('add')} className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white px-6 py-3 rounded-lg flex items-center gap-2 transition-all shadow-md hover:shadow-lg">
              <Plus className="w-5 h-5" />
              New Review
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
          {[
            { label: 'Total Reviews', value: reviews.length, color: 'purple', icon: BarChart3 },
            { label: 'Average Rating', value: avgRating, color: 'blue', icon: Star },
            { label: 'Top Performers', value: reviews.filter(r => r.overallRating >= 4.5).length, color: 'green', icon: Award },
            { label: 'This Quarter', value: reviews.filter(r => r.reviewPeriod?.includes('Q')).length, color: 'pink', icon: Calendar }
          ].map((stat, idx) => (
            <div key={idx} className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-slate-600 text-sm font-medium">{stat.label}</p>
                  <p className="text-3xl font-bold text-slate-800 mt-2">{stat.value}</p>
                </div>
                <div className={`bg-${stat.color}-100 p-3 rounded-lg`}>
                  <stat.icon className={`w-6 h-6 text-${stat.color}-600`} />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Filters */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
              <input type="text" placeholder="Search reviews..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full pl-10 pr-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent" />
            </div>
            <select value={periodFilter} onChange={(e) => setPeriodFilter(e.target.value)} className="px-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-purple-500">
              <option value="all">All Periods</option>
              <option value="Q1 2024">Q1 2024</option>
              <option value="Q2 2024">Q2 2024</option>
              <option value="Q3 2024">Q3 2024</option>
              <option value="Q4 2024">Q4 2024</option>
            </select>
            <select value={ratingFilter} onChange={(e) => setRatingFilter(e.target.value)} className="px-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-purple-500">
              <option value="all">All Ratings</option>
              <option value="4.5-5">Excellent (4.5-5)</option>
              <option value="3.5-4.4">Good (3.5-4.4)</option>
              <option value="2.5-3.4">Average (2.5-3.4)</option>
              <option value="0-2.4">Needs Improvement</option>
            </select>
            <button className="bg-slate-100 hover:bg-slate-200 text-slate-700 px-4 py-2.5 rounded-lg flex items-center justify-center gap-2 transition-all">
              <Download className="w-5 h-5" />
              Export
            </button>
          </div>
        </div>

        {/* Reviews Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filteredReviews.map(review => (
            <div key={review.id} className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 hover:shadow-md transition-all">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-full flex items-center justify-center text-white font-bold text-lg">
                    {review.employeeName?.charAt(0) || 'E'}
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-800 text-lg">{review.employeeName || 'N/A'}</h3>
                    <p className="text-sm text-slate-500">ID: {review.employeeId}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button onClick={() => openModal('view', review)} className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                    <Eye className="w-4 h-4" />
                  </button>
                  <button onClick={() => openModal('edit', review)} className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors">
                    <Edit className="w-4 h-4" />
                  </button>
                  <button onClick={() => handleDelete(review.id)} className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-600">Review Period</span>
                  <span className="font-semibold text-slate-800">{review.reviewPeriod || 'N/A'}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-600">Review Date</span>
                  <span className="font-semibold text-slate-800">{review.reviewDate || 'N/A'}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-600">Reviewer</span>
                  <span className="font-semibold text-slate-800">{review.reviewer || 'N/A'}</span>
                </div>
              </div>

              <div className="mt-4 pt-4 border-t border-slate-200">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-sm font-semibold text-slate-700">Overall Rating</span>
                  <div className="flex items-center gap-2">
                    <div className="flex">{getRatingStars(review.overallRating)}</div>
                    <span className={`px-3 py-1 rounded-full text-sm font-bold ${getRatingColor(review.overallRating)}`}>
                      {review.overallRating}/5
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 text-sm">
                  {[
                    { label: 'Productivity', value: review.productivity },
                    { label: 'Quality', value: review.quality },
                    { label: 'Communication', value: review.communication },
                    { label: 'Teamwork', value: review.teamwork }
                  ].map((metric, idx) => (
                    <div key={idx} className="flex items-center justify-between bg-slate-50 px-3 py-2 rounded-lg">
                      <span className="text-slate-600">{metric.label}</span>
                      <span className="font-semibold text-slate-800">{metric.value}/5</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredReviews.length === 0 && (
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-12 text-center">
            <TrendingUp className="w-16 h-16 text-slate-300 mx-auto mb-4" />
            <p className="text-slate-500 text-lg">No performance reviews found</p>
          </div>
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-gradient-to-r from-purple-600 to-indigo-600 px-6 py-4 flex justify-between items-center">
              <h2 className="text-2xl font-bold text-white">
                {modalMode === 'add' ? 'New Performance Review' : modalMode === 'edit' ? 'Edit Review' : 'Review Details'}
              </h2>
              <button onClick={closeModal} className="text-white hover:text-gray-200 transition-colors">
                <Target className="w-6 h-6" />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Employee ID</label>
                  <input type="text" value={formData.employeeId} onChange={(e) => setFormData({...formData, employeeId: e.target.value})} className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-purple-500" disabled={modalMode === 'view'} required />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Employee Name</label>
                  <input type="text" value={formData.employeeName} onChange={(e) => setFormData({...formData, employeeName: e.target.value})} className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-purple-500" disabled={modalMode === 'view'} required />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Review Period</label>
                  <input type="text" placeholder="e.g., Q1 2024" value={formData.reviewPeriod} onChange={(e) => setFormData({...formData, reviewPeriod: e.target.value})} className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-purple-500" disabled={modalMode === 'view'} required />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Review Date</label>
                  <input type="date" value={formData.reviewDate} onChange={(e) => setFormData({...formData, reviewDate: e.target.value})} className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-purple-500" disabled={modalMode === 'view'} required />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Reviewer</label>
                  <input type="text" value={formData.reviewer} onChange={(e) => setFormData({...formData, reviewer: e.target.value})} className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-purple-500" disabled={modalMode === 'view'} required />
                </div>
              </div>

              <div className="mt-6 p-4 bg-gradient-to-r from-purple-50 to-indigo-50 rounded-lg">
                <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
                  <Star className="w-5 h-5 text-purple-600" />
                  Performance Ratings
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {[
                    { label: 'Overall Rating', key: 'overallRating' },
                    { label: 'Productivity', key: 'productivity' },
                    { label: 'Quality', key: 'quality' },
                    { label: 'Communication', key: 'communication' },
                    { label: 'Teamwork', key: 'teamwork' },
                    { label: 'Initiative', key: 'initiative' }
                  ].map((rating, idx) => (
                    <div key={idx}>
                      <label className="block text-sm font-semibold text-slate-700 mb-2">{rating.label}</label>
                      <input type="number" min="1" max="5" step="0.1" value={formData[rating.key]} onChange={(e) => setFormData({...formData, [rating.key]: parseFloat(e.target.value)})} className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-purple-500" disabled={modalMode === 'view'} required />
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-6 space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Strengths</label>
                  <textarea value={formData.strengths} onChange={(e) => setFormData({...formData, strengths: e.target.value})} rows="3" className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-purple-500" disabled={modalMode === 'view'}></textarea>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Areas for Improvement</label>
                  <textarea value={formData.improvements} onChange={(e) => setFormData({...formData, improvements: e.target.value})} rows="3" className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-purple-500" disabled={modalMode === 'view'}></textarea>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Goals for Next Period</label>
                  <textarea value={formData.goals} onChange={(e) => setFormData({...formData, goals: e.target.value})} rows="3" className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-purple-500" disabled={modalMode === 'view'}></textarea>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Additional Comments</label>
                  <textarea value={formData.comments} onChange={(e) => setFormData({...formData, comments: e.target.value})} rows="3" className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-purple-500" disabled={modalMode === 'view'}></textarea>
                </div>
              </div>

              {modalMode !== 'view' && (
                <div className="flex justify-end gap-3 mt-6">
                  <button type="button" onClick={closeModal} className="px-6 py-2.5 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors">
                    Cancel
                  </button>
                  <button type="submit" className="px-6 py-2.5 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-lg hover:from-purple-700 hover:to-indigo-700 transition-colors">
                    {modalMode === 'add' ? 'Create Review' : 'Update Review'}
                  </button>
                </div>
              )}
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Performance;
