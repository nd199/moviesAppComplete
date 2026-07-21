import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { HiArrowLeft, HiCheckCircle, HiXCircle } from 'react-icons/hi2';
import { createContentManager } from '../../services/adminApi';

const NewContentManager = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ name: '', email: '', phoneNumber: '', department: '', specialization: 'both' });
  const [loading, setLoading] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [popupData, setPopupData] = useState({ success: false, message: '' });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await createContentManager(formData);
      setPopupData({ success: true, message: `Content manager account created and invite sent to ${formData.email}` });
      setFormData({ name: '', email: '', phoneNumber: '', department: '', specialization: 'both' });
    } catch (error) {
      setPopupData({ success: false, message: error.response?.data?.message || 'Network error. Please try again.' });
    } finally { setLoading(false); setShowPopup(true); }
  };

  const closePopup = () => { setShowPopup(false); if (popupData.success) navigate('/admin/content-managers'); };

  const inputClass = "w-full px-4 py-3 rounded-xl border border-surface-700 bg-surface-800 text-white placeholder-surface-500 focus:outline-none focus:ring-2 focus:ring-brand-500/50 focus:border-brand-500 transition-all text-sm";

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-white">Create Content Manager</h1>
          <p className="text-sm text-surface-500 mt-0.5">Create a new content manager account</p>
        </div>
        <button onClick={() => navigate('/admin/content-managers')}
          className="inline-flex items-center gap-2 rounded-xl border border-surface-700 bg-surface-800 px-4 py-2 text-sm font-semibold text-surface-500 hover:text-white hover:border-surface-600 transition-colors">
          <HiArrowLeft className="h-4 w-4" />
          Back
        </button>
      </div>

      <div className="max-w-2xl">
        <div className="bg-surface-900 border border-surface-700 rounded-2xl p-6">
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div><label className="block text-sm font-medium text-surface-500 mb-2">Full Name *</label><input name="name" type="text" required value={formData.name} onChange={handleChange} className={inputClass} placeholder="John Doe" /></div>
            <div><label className="block text-sm font-medium text-surface-500 mb-2">Email Address *</label><input name="email" type="email" required value={formData.email} onChange={handleChange} className={inputClass} placeholder="contentmanager@example.com" /></div>
            <div><label className="block text-sm font-medium text-surface-500 mb-2">Phone Number *</label><input name="phoneNumber" type="tel" required value={formData.phoneNumber} onChange={handleChange} className={inputClass} placeholder="1234567890" pattern="[0-9]{10}" title="Phone number must be exactly 10 digits" /></div>
            <div><label className="block text-sm font-medium text-surface-500 mb-2">Department</label><input name="department" type="text" value={formData.department} onChange={handleChange} className={inputClass} placeholder="Content Department (optional)" /></div>
            <div>
              <label className="block text-sm font-medium text-surface-500 mb-2">Specialization *</label>
              <select name="specialization" value={formData.specialization} onChange={handleChange} className={inputClass} required>
                <option value="both">Movies & Shows</option><option value="movies">Movies Only</option><option value="shows">Shows Only</option>
              </select>
            </div>

            <div>
              <button type="submit" disabled={loading || !formData.name || !formData.email}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-brand-600 to-accent-600 text-white font-semibold shadow-lg shadow-brand-500/20 hover:shadow-brand-500/30 disabled:opacity-50 disabled:cursor-not-allowed transition-all text-sm">
                {loading ? 'Creating...' : 'Create Content Manager Account'}
              </button>
            </div>
          </form>
        </div>
      </div>

      {showPopup && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-surface-900 border border-surface-700 rounded-2xl p-6 max-w-sm w-full mx-4 shadow-2xl">
            <div className="flex items-center justify-center mb-4">
              {popupData.success ? <HiCheckCircle className="h-12 w-12 text-emerald-400" /> : <HiXCircle className="h-12 w-12 text-red-400" />}
            </div>
            <h3 className={`text-lg font-semibold text-center mb-2 ${popupData.success ? 'text-white' : 'text-red-400'}`}>
              {popupData.success ? 'Success!' : 'Error!'}
            </h3>
            <p className="text-surface-500 text-center mb-4 text-sm">{popupData.message}</p>
            <button onClick={closePopup} className="w-full bg-surface-800 border border-surface-700 text-white py-2 px-4 rounded-xl hover:bg-surface-700 transition-colors text-sm font-semibold">
              {popupData.success ? 'View Content Managers' : 'Try Again'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default NewContentManager;
