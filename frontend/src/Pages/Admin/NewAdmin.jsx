import React from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { inviteAdmin } from '../../services/adminApi';

const inputClass =
  'w-full rounded-lg border border-white/10 bg-slate-950/40 px-3 py-2 text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-purple-500/40 transition-all';
const inputError = `${inputClass} !border-red-500`;

const inviteSchema = Yup.object({
  name: Yup.string().min(2, 'Too short').required('Name is required'),
  email: Yup.string().email('Invalid email').required('Email is required'),
  phoneNumber: Yup.string()
    .matches(/^\d{10}$/, 'Must be 10 digits')
    .required('Phone number is required'),
  address: Yup.string().min(3, 'Too short').required('Address is required'),
  department: Yup.string().required('Department is required'),
});

const NewAdmin = () => {
  const navigate = useNavigate();

  const handleSubmit = async (values, { setSubmitting, setFieldError }) => {
    setSubmitting(true);
    try {
      await inviteAdmin({
        name: values.name.trim(),
        email: values.email.toLowerCase().trim(),
        phoneNumber: values.phoneNumber.replace(/\D/g, ''),
        address: values.address.trim(),
        department: values.department.trim(),
      });
      toast.success(`Invite sent to ${values.email}`);
      navigate('/admin/admins');
    } catch (error) {
      const msg = error.response?.data?.message || 'Failed to send invite';
      if (msg.includes('already exists')) {
        setFieldError('email', msg);
      } else {
        toast.error(msg);
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="w-full">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold text-slate-100">Invite Admin</h1>
          <p className="text-sm text-slate-400">Send an invite to provision a new admin account</p>
        </div>
        <button
          type="button"
          onClick={() => navigate('/admin/admins')}
          className="rounded-lg border border-white/10 bg-white/5 px-4 py-2 text-sm font-semibold text-slate-200 hover:bg-white/10"
        >
          Back to Admins
        </button>
      </div>

      <div className="overflow-hidden rounded-2xl border border-white/10 bg-white/5 p-6 shadow-2xl shadow-black/20 backdrop-blur">
        <div className="text-lg font-semibold text-slate-100">Admin Details</div>
        <div className="mt-1 text-sm text-slate-400">
          The admin will set their own password via the invite link.
        </div>

        <Formik
          initialValues={{
            name: '',
            email: '',
            phoneNumber: '',
            address: '',
            department: '',
          }}
          validationSchema={inviteSchema}
          onSubmit={handleSubmit}
        >
          {({ isSubmitting, errors, touched }) => (
            <Form className="mt-6 space-y-5">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1">Name *</label>
                <Field
                  name="name"
                  placeholder="e.g. John Doe"
                  className={touched.name && errors.name ? inputError : inputClass}
                />
                <ErrorMessage name="name" component="p" className="text-red-400 text-xs mt-1" />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1">Email *</label>
                <Field
                  name="email"
                  type="email"
                  placeholder="john@example.com"
                  className={touched.email && errors.email ? inputError : inputClass}
                />
                <ErrorMessage name="email" component="p" className="text-red-400 text-xs mt-1" />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1">
                  Phone Number *
                </label>
                <Field
                  name="phoneNumber"
                  type="tel"
                  placeholder="10 digit number"
                  className={touched.phoneNumber && errors.phoneNumber ? inputError : inputClass}
                />
                <ErrorMessage
                  name="phoneNumber"
                  component="p"
                  className="text-red-400 text-xs mt-1"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1">Address *</label>
                <Field
                  as="textarea"
                  name="address"
                  rows="3"
                  placeholder="Office address"
                  className={
                    touched.address && errors.address
                      ? `${inputError} resize-none`
                      : `${inputClass} resize-none`
                  }
                />
                <ErrorMessage name="address" component="p" className="text-red-400 text-xs mt-1" />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1">
                  Department *
                </label>
                <Field
                  name="department"
                  placeholder="e.g. IT, HR, Finance"
                  className={
                    touched.department && errors.department ? inputError : inputClass
                  }
                />
                <ErrorMessage
                  name="department"
                  component="p"
                  className="text-red-400 text-xs mt-1"
                />
              </div>

              <div className="flex justify-end space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => navigate('/admin/admins')}
                  className="px-4 py-2 rounded-lg border border-white/10 bg-white/5 text-sm font-semibold text-slate-200 hover:bg-white/10"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-4 py-2 rounded-lg bg-gradient-to-r from-red-500 to-purple-600 text-sm font-semibold text-white shadow-lg shadow-red-500/10 hover:from-red-400 hover:to-purple-500 disabled:opacity-50"
                >
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
