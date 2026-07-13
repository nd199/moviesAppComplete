import { useState } from 'react';
import toast from 'react-hot-toast';
import { systemAPI } from '../services/api';

const InviteAdmin = () => {
  const [formData, setFormData] = useState({ name: '', email: '', phoneNumber: '', address: '' });
  const [loading, setLoading] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [popupData, setPopupData] = useState({ success: false, message: '' });

  const handleChange = (e) => setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await systemAPI.inviteAdmin(formData);
      setPopupData({ success: true, message: `Invitation sent to ${formData.email}. They will receive an email with setup instructions.` });
      setFormData({ name: '', email: '', phoneNumber: '', address: '' });
    } catch (error) {
      setPopupData({ success: false, message: error.response?.data?.message || 'Failed to send invitation' });
    } finally {
      setLoading(false);
      setShowPopup(true);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 p-6 text-white">
        <div className="absolute top-0 right-0 w-40 h-40 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/3" />
        <div className="relative z-10">
          <h2 className="text-2xl font-bold">Invite Administrator</h2>
          <p className="text-gray-400 mt-1">Send an email invitation to create a new admin account</p>
        </div>
      </div>

      <div className="bg-gray-100 rounded-2xl border border-gray-200 overflow-hidden shadow-sm">
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">Full Name *</label>
              <input type="text" name="name" value={formData.name} onChange={handleChange} required
                className="w-full px-4 py-2.5 bg-gray-200/60 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 transition-all text-sm"
                placeholder="John Doe" />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">Email Address *</label>
              <input type="email" name="email" value={formData.email} onChange={handleChange} required
                className="w-full px-4 py-2.5 bg-gray-200/60 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 transition-all text-sm"
                placeholder="admin@movies.com" />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">Phone Number *</label>
              <input type="tel" name="phoneNumber" value={formData.phoneNumber} onChange={handleChange} required
                pattern="[0-9]{10}" title="Must be exactly 10 digits"
                className="w-full px-4 py-2.5 bg-gray-200/60 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 transition-all text-sm"
                placeholder="1234567890" />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">Office Address *</label>
              <input type="text" name="address" value={formData.address} onChange={handleChange} required
                className="w-full px-4 py-2.5 bg-gray-200/60 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 transition-all text-sm"
                placeholder="123 Main St, City" />
            </div>
          </div>
          <div className="flex justify-end pt-2">
            <button type="submit" disabled={loading || !formData.name || !formData.email}
              className="px-6 py-2.5 bg-gradient-to-r from-red-600 to-orange-600 text-white text-sm font-semibold rounded-xl shadow-lg shadow-red-500/25 hover:shadow-red-500/40 transition-all disabled:opacity-50">
              {loading ? 'Sending...' : 'Send Invitation'}
            </button>
          </div>
        </form>
      </div>

      {showPopup && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-gray-100 rounded-2xl border border-gray-200 p-8 max-w-sm w-full mx-4 shadow-2xl">
            <div className="flex items-center justify-center mb-6">
              <div className={`w-16 h-16 rounded-full flex items-center justify-center ${popupData.success ? 'bg-emerald-100' : 'bg-red-100'}`}>
                {popupData.success ? (
                  <svg className="w-8 h-8 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                ) : (
                  <svg className="w-8 h-8 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                )}
              </div>
            </div>
            <h3 className={`text-lg font-bold text-center mb-2 ${popupData.success ? 'text-emerald-700' : 'text-red-700'}`}>
              {popupData.success ? 'Invitation Sent' : 'Error'}
            </h3>
            <p className="text-gray-600 text-sm text-center mb-6">{popupData.message}</p>
            <button onClick={() => setShowPopup(false)}
              className={`w-full py-2.5 text-white text-sm font-semibold rounded-xl transition-all ${popupData.success ? 'bg-emerald-600 hover:bg-emerald-700' : 'bg-red-600 hover:bg-red-700'}`}>
              {popupData.success ? 'Done' : 'Try Again'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default InviteAdmin;
