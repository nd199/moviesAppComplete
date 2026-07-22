import React from 'react';
import { useNavigate } from 'react-router-dom';
import { HiArrowLeft } from 'react-icons/hi2';
import toast from 'react-hot-toast';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { inviteAdmin } from '../../services/adminApi';

const inputClass = 'w-full rounded-xl border border-surface-700 bg-surface-800 px-3 py-2.5 text-sm text-white placeholder-surface-500 focus:outline-none focus:ring-2 focus:ring-brand-500/50 focus:border-brand-500 transition-all';
const inputError = `${inputClass} !border-red-500`;

const inviteSchema = Yup.object({
  name: Yup.string().min(2, 'Too short').required('Name is required'),
  email: Yup.string().email('Invalid email').required('Email is required'),
  phoneNumber: Yup.string().matches(/^\d{10}$/, 'Must be 10 digits').required('Phone number is required'),
  address: Yup.string().min(3, 'Too short').required('Address is required'),
  department: Yup.string().required('Department is required'),
});

const NewAdmin = () => {
  const navigate = useNavigate();

  const handleSubmit = async (values, { setSubmitting, setFieldError }) => {
    setSubmitting(true);
    try {
      await inviteAdmin({
        name: values.name.trim(), email: values.email.toLowerCase().trim(),
        phoneNumber: values.phoneNumber.replace(/\D/g, ''), address: values.address.trim(), department: values.department.trim(),
      });
      toast.success(`Invite sent to ${values.email}`);
      navigate('/admin/admins');
    } catch (error) {
      const msg = error.response?.data?.message || 'Failed to send invite';
      if (msg.includes('already exists')) setFieldError('email', msg);
      else toast.error(msg);
    } finally { setSubmitting(false); }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="min-w-0">
          <h1 className="text-xl font-bold text-white">Invite Admin</h1>
          <p className="text-sm text-surface-500 mt-0.5">Send an invite to provision a new admin account</p>
        </div>
        <button onClick={() => navigate('/admin/admins')}
          className="inline-flex items-center justify-center gap-2 rounded-xl border border-surface-700 bg-surface-800 px-4 py-2 text-sm font-semibold text-surface-500 hover:text-white hover:border-surface-600 transition-colors shrink-0">
          <HiArrowLeft className="h-4 w-4" />
          Back to Admins
        </button>
      </div>

      <div className="bg-surface-900 border border-surface-700 rounded-2xl p-6 max-w-2xl">
        <div className="text-lg font-semibold text-white">Admin Details</div>
        <div className="mt-1 text-sm text-surface-500">The admin will set their own password via the invite link.</div>

        <Formik initialValues={{ name: '', email: '', phoneNumber: '', address: '', department: '' }} validationSchema={inviteSchema} onSubmit={handleSubmit}>
          {({ isSubmitting, errors, touched }) => (
            <Form className="mt-6 space-y-5">
              <div><label className="block text-sm font-medium text-surface-500 mb-1">Name *</label><Field name="name" placeholder="e.g. John Doe" className={touched.name && errors.name ? inputError : inputClass} /><ErrorMessage name="name" component="p" className="text-red-400 text-xs mt-1" /></div>
              <div><label className="block text-sm font-medium text-surface-500 mb-1">Email *</label><Field name="email" type="email" placeholder="john@example.com" className={touched.email && errors.email ? inputError : inputClass} /><ErrorMessage name="email" component="p" className="text-red-400 text-xs mt-1" /></div>
              <div><label className="block text-sm font-medium text-surface-500 mb-1">Phone Number *</label><Field name="phoneNumber" type="tel" placeholder="10 digit number" className={touched.phoneNumber && errors.phoneNumber ? inputError : inputClass} /><ErrorMessage name="phoneNumber" component="p" className="text-red-400 text-xs mt-1" /></div>
              <div><label className="block text-sm font-medium text-surface-500 mb-1">Address *</label><Field as="textarea" name="address" rows="3" placeholder="Office address" className={touched.address && errors.address ? `${inputError} resize-none` : `${inputClass} resize-none`} /><ErrorMessage name="address" component="p" className="text-red-400 text-xs mt-1" /></div>
              <div><label className="block text-sm font-medium text-surface-500 mb-1">Department *</label><Field name="department" placeholder="e.g. IT, HR, Finance" className={touched.department && errors.department ? inputError : inputClass} /><ErrorMessage name="department" component="p" className="text-red-400 text-xs mt-1" /></div>

              <div className="flex justify-end space-x-3 pt-4">
                <button type="button" onClick={() => navigate('/admin/admins')} className="px-4 py-2 rounded-xl border border-surface-700 bg-surface-800 text-sm font-semibold text-surface-500 hover:text-white hover:border-surface-600 transition-colors">Cancel</button>
                <button type="submit" disabled={isSubmitting} className="px-4 py-2 rounded-xl bg-gradient-to-r from-brand-600 to-accent-600 text-sm font-semibold text-white shadow-lg shadow-brand-500/20 hover:shadow-brand-500/30 disabled:opacity-50 transition-all">
                  {isSubmitting ? 'Sending Invite...' : 'Send Invite'}
                </button>
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
};

export default NewAdmin;
