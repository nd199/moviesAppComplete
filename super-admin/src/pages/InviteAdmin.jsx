import { useState } from 'react';
import toast from 'react-hot-toast';
import { systemAPI } from '../services/api';

const sanitize = (str) => str.replace(/[<>]/g, '').trim();

const InviteAdmin = () => {
  const [formData, setFormData] = useState({ name: '', email: '', phoneNumber: '', address: '', department: '' });
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: sanitize(value) }));
  };

  const canProceedStep1 = formData.name.length >= 2 && formData.email.includes('@') && formData.phoneNumber.length === 10;
  const canSubmit = canProceedStep1 && formData.address.length >= 5;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await systemAPI.inviteAdmin({
        name: formData.name,
        email: formData.email.toLowerCase().trim(),
        phoneNumber: formData.phoneNumber.replace(/\D/g, ''),
        address: formData.address,
        department: formData.department,
      });
      toast.success('Invitation sent successfully');
      setFormData({ name: '', email: '', phoneNumber: '', address: '', department: '' });
      setStep(1);
    } catch (error) {
      toast.error('Failed to process request');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 p-4 sm:p-6 text-white">
        <div className="absolute top-0 right-0 w-40 h-40 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/3" />
        <div className="relative z-10">
          <h2 className="text-xl sm:text-2xl font-bold">Invite Administrator</h2>
          <p className="text-gray-400 mt-1 text-sm">Send an email invitation to create a new admin account</p>
        </div>
      </div>

      {/* Progress Steps */}
      <div className="flex items-center justify-center gap-2">
        {[1, 2].map(s => (
          <div key={s} className="flex items-center gap-2">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-colors ${
              step >= s ? 'bg-red-600 text-white' : 'bg-gray-200 text-gray-500'
            }`}>
              {s}
            </div>
            {s < 2 && <div className={`w-12 h-0.5 ${step > 1 ? 'bg-red-600' : 'bg-gray-200'}`} />}
          </div>
        ))}
      </div>

      <div className="bg-gray-100 rounded-2xl border border-gray-200 overflow-hidden shadow-sm">
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {step === 1 && (
            <div className="space-y-5 animate-in fade-in slide-in-from-bottom-2">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Full Name *</label>
                <input type="text" name="name" value={formData.name} onChange={handleChange} required
                  maxLength={100}
                  className="w-full px-4 py-2.5 bg-gray-200/60 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 transition-all text-sm"
                  placeholder="John Doe" />
                {formData.name.length > 0 && formData.name.length < 2 && (
                  <p className="text-xs text-red-500 mt-1">Name must be at least 2 characters</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Email Address *</label>
                <input type="email" name="email" value={formData.email} onChange={handleChange} required
                  maxLength={254}
                  className="w-full px-4 py-2.5 bg-gray-200/60 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 transition-all text-sm"
                  placeholder="admin@movies.com" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Phone Number *</label>
                <input type="tel" name="phoneNumber" value={formData.phoneNumber} onChange={handleChange} required
                  pattern="[0-9]{10}" title="Must be exactly 10 digits" maxLength={10}
                  className="w-full px-4 py-2.5 bg-gray-200/60 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 transition-all text-sm"
                  placeholder="1234567890" />
              </div>
              <div className="flex justify-end pt-2">
                <button type="button" onClick={() => canProceedStep1 && setStep(2)}
                  disabled={!canProceedStep1}
                  className="px-6 py-2.5 bg-gradient-to-r from-gray-900 to-gray-800 text-white text-sm font-semibold rounded-xl shadow-lg transition-all disabled:opacity-50">
                  Next
                </button>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-5 animate-in fade-in slide-in-from-bottom-2">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Department</label>
                <input type="text" name="department" value={formData.department} onChange={handleChange}
                  maxLength={100}
                  className="w-full px-4 py-2.5 bg-gray-200/60 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 transition-all text-sm"
                  placeholder="Engineering" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Office Address *</label>
                <input type="text" name="address" value={formData.address} onChange={handleChange} required
                  maxLength={200}
                  className="w-full px-4 py-2.5 bg-gray-200/60 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 transition-all text-sm"
                  placeholder="123 Main St, City" />
                {formData.address.length > 0 && formData.address.length < 5 && (
                  <p className="text-xs text-red-500 mt-1">Address must be at least 5 characters</p>
                )}
              </div>

              {/* Summary */}
              <div className="bg-white rounded-xl p-4 border border-gray-200">
                <h4 className="text-sm font-semibold text-gray-700 mb-3">Review Invitation</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between"><span className="text-gray-500">Name</span><span className="font-medium text-gray-900">{formData.name}</span></div>
                  <div className="flex justify-between"><span className="text-gray-500">Email</span><span className="font-medium text-gray-900">{formData.email}</span></div>
                  <div className="flex justify-between"><span className="text-gray-500">Phone</span><span className="font-medium text-gray-900">{formData.phoneNumber}</span></div>
                  {formData.department && <div className="flex justify-between"><span className="text-gray-500">Department</span><span className="font-medium text-gray-900">{formData.department}</span></div>}
                  <div className="flex justify-between"><span className="text-gray-500">Address</span><span className="font-medium text-gray-900">{formData.address}</span></div>
                </div>
              </div>

              <div className="flex justify-between pt-2">
                <button type="button" onClick={() => setStep(1)}
                  className="px-6 py-2.5 bg-gray-200 text-gray-700 text-sm font-semibold rounded-xl transition-colors">
                  Back
                </button>
                <button type="submit" disabled={loading || !canSubmit}
                  className="px-6 py-2.5 bg-gradient-to-r from-red-600 to-orange-600 text-white text-sm font-semibold rounded-xl shadow-lg shadow-red-500/25 hover:shadow-red-500/40 transition-all disabled:opacity-50">
                  {loading ? 'Sending...' : 'Send Invitation'}
                </button>
              </div>
            </div>
          )}
        </form>
      </div>
    </div>
  );
};

export default InviteAdmin;
