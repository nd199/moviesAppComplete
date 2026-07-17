import { Box, LinearProgress } from "@mui/material";
import { ErrorMessage, Field, Form, Formik } from "formik";
import { useCallback, useEffect, useMemo, useState } from "react";
import { HiCamera, HiLocationMarker, HiLockClosed, HiOutlinePhone, HiOutlineUser } from "react-icons/hi";
import PasswordStrengthBar from "react-password-strength-bar";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import * as Yup from "yup";
import EmailVerifyUser from "../../Components/EmailVerifyUser";
import { uploadToImgBB } from "../../ImgBB";
import { register } from "../../Network/ApiCalls";
import { resetErrorMessage } from "../../redux/userSlice";
import regBg from "./REGBack.jpg";

const inputClass = "w-full h-[50px] px-4 rounded-xl glass border-white/10 text-white text-sm placeholder:text-white/30 focus:outline-none focus:border-brand-500/40 focus:shadow-[0_0_20px_rgba(124,58,237,0.1)] transition-all";
const inputError = `${inputClass} !border-red-500`;

const RegistrationForm = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const serverError = useSelector(s => s.user.errorMessage);
  const [avatarPreview, setAvatarPreview] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [emailVerified, setEmailVerified] = useState(false);

  useEffect(() => () => dispatch(resetErrorMessage()), [dispatch]);

  const handleAvatar = useCallback((e, setFieldValue) => {
    const file = e.currentTarget.files?.[0];
    if (!file || !file.type.startsWith("image/") || file.size > 5 * 1024 * 1024) return;
    setFieldValue("avatar", file);
    const r = new FileReader(); r.onloadend = () => setAvatarPreview(r.result); r.readAsDataURL(file);
  }, []);

  const schema = Yup.object({
    name: Yup.string().min(2).required("Required"),
    email: Yup.string().email("Invalid").required("Required"),
    phoneNumber: Yup.string().matches(/^\d{10}$/, "10 digits").required("Required"),
    address: Yup.string().min(5).required("Required"),
    password: Yup.string().min(8).required("Required"),
    confirmPassword: Yup.string().oneOf([Yup.ref("password")], "Must match").required("Required"),
    avatar: Yup.mixed().required("Required").test("file", "Required", v => v instanceof File),
  });

  const handleSubmit = async (values, { setSubmitting, setFieldError }) => {
    if (!emailVerified) { setFieldError("email", "Verify email first"); return; }
    setSubmitting(true); setUploadProgress(20);
    try {
      const imageUrl = await uploadToImgBB(values.avatar, setUploadProgress);
      await register(dispatch, { name: values.name.trim(), email: values.email.toLowerCase(), password: values.password, phoneNumber: values.phoneNumber.replace(/\D/g, ""), address: values.address, imageUrl });
      setUploadProgress(100);
      setTimeout(() => navigate("/login"), 1000);
    } catch { setUploadProgress(0); setFieldError("general", "Registration failed"); }
    finally { setSubmitting(false); }
  };

  const ready = useMemo(() => emailVerified && uploadProgress === 0, [emailVerified, uploadProgress]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-5 relative"
      style={{ backgroundImage: `linear-gradient(rgba(5,8,16,0.9),rgba(5,8,16,0.9)),url(${regBg})`, backgroundSize: 'cover', backgroundPosition: 'center', backgroundAttachment: 'fixed' }}>

      {/* Ambient glow */}
      <div className="absolute top-[15%] right-[10%] w-[400px] h-[400px] bg-brand-500/5 blur-[150px] pointer-events-none" />
      <div className="absolute bottom-[10%] left-[5%] w-[300px] h-[300px] bg-accent-500/5 blur-[120px] pointer-events-none" />

      <div className="w-full max-w-[1000px] glass-strong rounded-3xl shadow-[0_25px_80px_rgba(0,0,0,0.5)] overflow-hidden relative">
        {/* Top glow line */}
        <div className="absolute -top-px left-1/2 -translate-x-1/2 w-[40%] h-px bg-gradient-to-r from-transparent via-brand-500/40 to-transparent" />

        <div className="text-center p-6 sm:p-8 border-b border-white/5">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-brand-500 to-accent-500 flex items-center justify-center mx-auto mb-4 shadow-[0_8px_30px_rgba(124,58,237,0.3)]">
            <span className="text-white font-black text-xl">C</span>
          </div>
          <h1 className="text-2xl font-black text-white m-0 mb-1 tracking-tight">Create Account</h1>
          <p className="text-[#5a6380] text-sm m-0">Join us today and start streaming</p>
        </div>

        <Formik initialValues={{ name: "", email: "", phoneNumber: "", address: "", password: "", confirmPassword: "", avatar: null }} validationSchema={schema} onSubmit={handleSubmit}>
          {({ isSubmitting, setFieldValue, values, errors, touched }) => (
            <Form className="p-6 sm:p-8 grid grid-cols-[280px_1fr] gap-8 max-md:grid-cols-1 max-md:gap-6">
              {/* Avatar column */}
              <div className="flex flex-col items-center gap-4 max-md:order-[-1]">
                <label className="flex flex-col items-center gap-3 p-8 rounded-2xl border-2 border-dashed border-white/10 text-[#8892b0] cursor-pointer hover:border-brand-500/30 hover:text-white transition-all w-full group">
                  <HiCamera className="text-3xl group-hover:scale-110 transition-transform" />
                  <span className="text-xs font-medium">Upload Photo</span>
                  <span className="text-[0.65rem] text-[#4a5568]">JPG, PNG · Max 5MB</span>
                  <input type="file" className="hidden" accept="image/*" onChange={e => handleAvatar(e, setFieldValue)} />
                </label>
                <ErrorMessage name="avatar" component="p" className="text-red-400 text-xs m-0" />
                {avatarPreview && (
                  <div className="relative">
                    <img src={avatarPreview} alt="" className="w-32 h-40 rounded-2xl object-cover border border-white/10 shadow-lg" />
                    <div className="absolute inset-0 rounded-2xl ring-2 ring-brand-500/30 ring-offset-2 ring-offset-surface-900" />
                  </div>
                )}
                {uploadProgress > 0 && (
                  <div className="w-full flex items-center gap-3">
                    <Box sx={{ width: "100%" }}>
                      <LinearProgress variant="determinate" value={uploadProgress}
                        sx={{ '& .MuiLinearProgress-bar': { background: 'linear-gradient(90deg, #7c3aed, #06b6d4)' }, backgroundColor: 'rgba(255,255,255,0.05)' }} />
                    </Box>
                    <span className="text-xs text-[#8892b0] font-mono">{uploadProgress}%</span>
                  </div>
                )}
              </div>

              {/* Form fields */}
              <div className="flex flex-col gap-5">
                <div className="grid grid-cols-2 gap-4 max-md:grid-cols-1">
                  <Field name="name">
                    {({ field }) => (
                      <div className="flex flex-col gap-1.5">
                        <label className="text-xs font-semibold text-[#8892b0] uppercase tracking-wider flex items-center gap-1.5"><HiOutlineUser /> Name</label>
                        <input {...field} placeholder="John Doe" className={touched.name && errors.name ? inputError : inputClass} />
                        <ErrorMessage name="name" component="p" className="text-red-400 text-xs m-0" />
                      </div>
                    )}
                  </Field>
                  <EmailVerifyUser onEmailVerified={(v) => { setEmailVerified(!!v); setFieldValue("email", v || ""); }} />
                </div>
                <div className="grid grid-cols-2 gap-4 max-md:grid-cols-1">
                  <Field name="phoneNumber">
                    {({ field }) => (
                      <div className="flex flex-col gap-1.5">
                        <label className="text-xs font-semibold text-[#8892b0] uppercase tracking-wider flex items-center gap-1.5"><HiOutlinePhone /> Phone</label>
                        <input {...field} placeholder="10-digit number" className={touched.phoneNumber && errors.phoneNumber ? inputError : inputClass} />
                        <ErrorMessage name="phoneNumber" component="p" className="text-red-400 text-xs m-0" />
                      </div>
                    )}
                  </Field>
                  <Field name="address">
                    {({ field }) => (
                      <div className="flex flex-col gap-1.5">
                        <label className="text-xs font-semibold text-[#8892b0] uppercase tracking-wider flex items-center gap-1.5"><HiLocationMarker /> Address</label>
                        <input {...field} placeholder="City, Country" className={touched.address && errors.address ? inputError : inputClass} />
                        <ErrorMessage name="address" component="p" className="text-red-400 text-xs m-0" />
                      </div>
                    )}
                  </Field>
                </div>
                <div className="grid grid-cols-2 gap-4 max-md:grid-cols-1">
                  <Field name="password">
                    {({ field }) => (
                      <div className="flex flex-col gap-1.5">
                        <label className="text-xs font-semibold text-[#8892b0] uppercase tracking-wider flex items-center gap-1.5"><HiLockClosed /> Password</label>
                        <input type="password" placeholder="Min 8 characters" {...field} className={inputClass} />
                        {values.password && <PasswordStrengthBar password={values.password} />}
                        <ErrorMessage name="password" component="p" className="text-red-400 text-xs m-0" />
                      </div>
                    )}
                  </Field>
                  <Field name="confirmPassword">
                    {({ field }) => (
                      <div className="flex flex-col gap-1.5">
                        <label className="text-xs font-semibold text-[#8892b0] uppercase tracking-wider">Confirm Password</label>
                        <input type="password" placeholder="Repeat password" {...field} className={inputClass} />
                        <ErrorMessage name="confirmPassword" component="p" className="text-red-400 text-xs m-0" />
                      </div>
                    )}
                  </Field>
                </div>

                {serverError && (
                  <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm text-center animate-fade-in">
                    {serverError}
                  </div>
                )}

                <button type="submit" disabled={isSubmitting || !ready}
                  className="w-full py-3.5 rounded-xl btn-primary font-bold text-sm border-none disabled:opacity-50 disabled:cursor-not-allowed uppercase tracking-wider flex items-center justify-center gap-2">
                  {isSubmitting ? (
                    <><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Creating...</>
                  ) : "Create Account"}
                </button>

                <p className="text-center text-sm text-[#5a6380] m-0">
                  Have an account?{' '}
                  <Link to="/login" className="text-brand-400 font-semibold no-underline hover:text-brand-300 transition-colors">Sign in</Link>
                </p>
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
};

export default RegistrationForm;
