import { useState } from 'react';
import toast from 'react-hot-toast';
import { systemAPI } from '../services/api';

const InviteAdmin = () => {
  const [formData, setFormData] = useState({ name: '', email: '', phoneNumber: '', address: '', department: '' });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await systemAPI.inviteAdmin(formData);
      toast.success(`Invitation sent to ${formData.email}`);
      setFormData({ name: '', email: '', phoneNumber: '', address: '', department: '' });
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to send invitation');
    } finally {
      setLoading(false);
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
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">Department</label>
              <input type="text" name="department" value={formData.department} onChange={handleChange}
                className="w-full px-4 py-2.5 bg-gray-200/60 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 transition-all text-sm"
                placeholder="Engineering" />
            </div>
            <div className="md:col-span-2">
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
    </div>
  );
};

export default InviteAdmin;
