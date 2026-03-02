import { useState } from 'react';
import toast from 'react-hot-toast';
import { HiUserPlus, HiEnvelope, HiCheckCircle, HiXCircle } from 'react-icons/hi2';

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

  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080';

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
      const response = await fetch(`${API_BASE_URL}/system/superadmin/invite`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
        credentials: 'include'
      });

      const data = await response.json();

      if (response.ok) {
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
          message: data.message || 'Failed to send invite'
        });
      }
    } catch (error) {
      setPopupData({
        success: false,
        message: 'Network error. Please try again.'
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
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-red-100 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <div className="mx-auto h-16 w-16 bg-red-600 rounded-full flex items-center justify-center">
            <HiUserPlus className="h-8 w-8 text-white" />
          </div>
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
            Create Admin Account
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Create a new administrator account and send setup instructions
          </p>
        </div>
        
        <div className="bg-white shadow-xl rounded-lg p-8">
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                Full Name
              </label>
              <input
                id="name"
                name="name"
                type="text"
                required
                value={formData.name}
                onChange={handleChange}
                className="appearance-none relative block w-full px-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none focus:ring-red-500 focus:border-red-500 focus:z-10 sm:text-sm"
                placeholder="John Doe"
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
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
                  className="appearance-none relative block w-full pl-10 pr-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none focus:ring-red-500 focus:border-red-500 focus:z-10 sm:text-sm"
                  placeholder="admin@example.com"
                />
              </div>
            </div>

            <div>
              <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-700 mb-2">
                Phone Number
              </label>
              <input
                id="phoneNumber"
                name="phoneNumber"
                type="tel"
                required
                value={formData.phoneNumber}
                onChange={handleChange}
                className="appearance-none relative block w-full px-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none focus:ring-red-500 focus:border-red-500 focus:z-10 sm:text-sm"
                placeholder="1234567890"
                pattern="[0-9]{10}"
                title="Phone number must be exactly 10 digits"
              />
            </div>

            <div>
              <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-2">
                Address
              </label>
              <input
                id="address"
                name="address"
                type="text"
                required
                value={formData.address}
                onChange={handleChange}
                className="appearance-none relative block w-full px-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none focus:ring-red-500 focus:border-red-500 focus:z-10 sm:text-sm"
                placeholder="123 Main St, City, State"
              />
            </div>

            <div>
              <button
                type="submit"
                disabled={loading || !formData.name || !formData.email}
                className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50 disabled:cursor-not-allowed transition duration-200"
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
                  'Create Admin Account'
                )}
              </button>
            </div>
          </form>
        </div>

        {/* Success/Error Popup */}
        {showPopup && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 max-w-sm w-full mx-4">
              <div className="flex items-center justify-center mb-4">
                {popupData.success ? (
                  <HiCheckCircle className="h-12 w-12 text-green-500" />
                ) : (
                  <HiXCircle className="h-12 w-12 text-red-500" />
                )}
              </div>
              
              <h3 className={`text-lg font-semibold text-center mb-2 ${popupData.success ? 'text-green-800' : 'text-red-800'}`}>
                {popupData.success ? 'Success!' : 'Error!'}
              </h3>
              
              <p className="text-gray-600 text-center mb-4">
                {popupData.message}
              </p>

              <button
                onClick={closePopup}
                className="w-full bg-gray-500 text-white py-2 px-4 rounded hover:bg-gray-600 transition-colors"
              >
                {popupData.success ? 'Send Another' : 'Try Again'}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SuperAdminInvite;
