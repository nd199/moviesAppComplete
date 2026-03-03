import { useState } from 'react';
import toast from 'react-hot-toast';
import { HiUserPlus, HiEnvelope, HiCheckCircle, HiXCircle, HiSparkles, HiBuildingOffice, HiPhone, HiMapPin } from 'react-icons/hi2';
import { authAPI, adminAPI } from '../services/api';

const SuperAdminInvite = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phoneNumber: '',
    address: ''
  });
  const [loading, setLoading] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [popupData, setPopupData] = useState({ success: false, message: '' });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await adminAPI.inviteAdmin(formData);

      if (response.status === 200) {
        setPopupData({
          success: true,
          message: `Admin account created and invite sent to ${formData.email}`
        });
        setFormData({
          name: '',
          email: '',
          phoneNumber: '',
          address: ''
        });
      } else {
        setPopupData({
          success: false,
          message: response.data?.message || 'Failed to send invite'
        });
      }
    } catch (error) {
      setPopupData({
        success: false,
        message: error.response?.data?.message || 'Network error. Please try again.'
      });
    } finally {
      setLoading(false);
      setShowPopup(true);
    }
  };

  const closePopup = () => {
    setShowPopup(false);
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gray-800 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gray-700 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse animation-delay-2000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gray-900 rounded-full mix-blend-multiply filter blur-xl opacity-10 animate-pulse animation-delay-4000"></div>
      </div>

      <div className="relative z-10 max-w-md w-full space-y-8">
        <div className="text-center">
          <div className="mx-auto h-20 w-20 bg-gradient-to-br from-gray-700 to-gray-900 rounded-full flex items-center justify-center shadow-2xl transform hover:scale-105 transition-transform duration-300">
            <HiUserPlus className="h-10 w-10 text-white" />
          </div>
          <h2 className="mt-8 text-4xl font-bold text-white">
            Admin Invitation
          </h2>
          <p className="mt-3 text-lg text-gray-300">
            Create Administrator Account
          </p>
          <div className="mt-4 flex items-center justify-center space-x-2">
            <HiSparkles className="h-5 w-5 text-yellow-400" />
            <span className="text-sm text-gray-400">Invite Team Members</span>
            <HiSparkles className="h-5 w-5 text-yellow-400" />
          </div>
        </div>
        
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 shadow-2xl border border-white/20">
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-2">
                Full Name
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <HiUserPlus className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="name"
                  name="name"
                  type="text"
                  required
                  value={formData.name}
                  onChange={handleChange}
                  className="appearance-none relative block w-full pl-10 pr-3 py-3 border border-gray-600/30 bg-white/10 backdrop-blur-sm placeholder-gray-400 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent focus:z-10 sm:text-sm transition-all duration-200"
                  placeholder="John Doe"
                />
              </div>
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">
                Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <HiEnvelope className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  className="appearance-none relative block w-full pl-10 pr-3 py-3 border border-gray-600/30 bg-white/10 backdrop-blur-sm placeholder-gray-400 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent focus:z-10 sm:text-sm transition-all duration-200"
                  placeholder="admin@movies.com"
                />
              </div>
            </div>

            <div>
              <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-300 mb-2">
                Phone Number
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <HiPhone className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="phoneNumber"
                  name="phoneNumber"
                  type="tel"
                  required
                  value={formData.phoneNumber}
                  onChange={handleChange}
                  className="appearance-none relative block w-full pl-10 pr-3 py-3 border border-gray-600/30 bg-white/10 backdrop-blur-sm placeholder-gray-400 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent focus:z-10 sm:text-sm transition-all duration-200"
                  placeholder="1234567890"
                  pattern="[0-9]{10}"
                  title="Phone number must be exactly 10 digits"
                />
              </div>
            </div>

            <div>
              <label htmlFor="address" className="block text-sm font-medium text-gray-300 mb-2">
                Office Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <HiMapPin className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="address"
                  name="address"
                  type="text"
                  required
                  value={formData.address}
                  onChange={handleChange}
                  className="appearance-none relative block w-full pl-10 pr-3 py-3 border border-gray-600/30 bg-white/10 backdrop-blur-sm placeholder-gray-400 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent focus:z-10 sm:text-sm transition-all duration-200"
                  placeholder="123 Main St, City, State"
                />
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={loading || !formData.name || !formData.email}
                className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-gradient-to-r from-gray-700 to-gray-900 hover:from-gray-800 hover:to-black focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 transform hover:scale-[1.02] shadow-lg"
              >
                {loading ? (
                  <span className="flex items-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Creating Admin Account...
                  </span>
                ) : (
                  <span className="flex items-center">
                    <HiBuildingOffice className="mr-2 h-5 w-5" />
                    Create Admin Account
                  </span>
                )}
              </button>
            </div>
          </form>
        </div>

        {showPopup && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
            <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 max-w-sm w-full mx-4 border border-white/20 shadow-2xl">
              <div className="flex items-center justify-center mb-6">
                {popupData.success ? (
                  <div className="h-16 w-16 bg-green-500/20 rounded-full flex items-center justify-center">
                    <HiCheckCircle className="h-8 w-8 text-green-400" />
                  </div>
                ) : (
                  <div className="h-16 w-16 bg-red-500/20 rounded-full flex items-center justify-center">
                    <HiXCircle className="h-8 w-8 text-red-400" />
                  </div>
                )}
              </div>
              
              <h3 className={`text-xl font-bold text-center mb-3 ${popupData.success ? 'text-green-400' : 'text-red-400'}`}>
                {popupData.success ? 'Invitation Sent!' : 'Error!'}
              </h3>
              
              <p className="text-gray-300 text-center mb-6 leading-relaxed">
                {popupData.message}
              </p>

              <button
                onClick={closePopup}
                className="w-full bg-gradient-to-r from-gray-700 to-gray-900 text-white py-3 px-4 rounded-lg hover:from-gray-800 hover:to-black transition-all duration-300 transform hover:scale-[1.02] shadow-lg"
              >
                {popupData.success ? 'Send Another' : 'Try Again'}
              </button>
            </div>
          </div>
        )}
      </div>

      <style jsx>{`
        @keyframes pulse {
          0%, 100% { opacity: 0.1; }
          50% { opacity: 0.2; }
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
      `}</style>
    </div>
  );
};

export default SuperAdminInvite;
