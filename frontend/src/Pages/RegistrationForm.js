// RegistrationForm.jsx
import { Box, LinearProgress } from "@mui/material";
import { ErrorMessage, Field, Form, Formik } from "formik";
import { useCallback, useEffect, useMemo, useState } from "react";
import {
  HiCamera,
  HiLocationMarker,
  HiLockClosed,
  HiOutlinePhone,
  HiOutlineUser,
} from "react-icons/hi";
import PasswordStrengthBar from "react-password-strength-bar";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import * as Yup from "yup";
import EmailVerifyUser from "../Components/EmailVerifyUser";
import { uploadToImgBB } from "../ImgBB";
import { register } from "../Network/ApiCalls";
import { resetErrorMessage } from "../redux/userSlice";
import "./Registration.css";

const phoneRegex = /^[+][0-9]{1,4}[0-9]{7,12}$/;

const RegistrationForm = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const serverError = useSelector((state) => state.user.errorMessage?.message);

  const [avatarPreview, setAvatarPreview] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isEmailVerified, setIsEmailVerified] = useState(false);

  useEffect(() => {
    return () => dispatch(resetErrorMessage());
  }, [dispatch]);

  const handleAvatarChange = useCallback((e, setFieldValue) => {
    const file = e.target.files[0];
    if (!file) return;
    if (!file.type.startsWith("image/") || file.size > 5 * 1024 * 1024) return;

    setFieldValue("avatar", file);
    const reader = new FileReader();
    reader.onloadend = () => setAvatarPreview(reader.result);
    reader.readAsDataURL(file);
  }, []);

  const validationSchema = Yup.object({
    name: Yup.string().min(2, "Too short").required("Required"),
    email: Yup.string().email("Invalid email").required("Required"),
    phoneNumber: Yup.string()
      .matches(phoneRegex, "Invalid phone")
      .required("Required"),
    address: Yup.string().min(5, "Too short").required("Required"),
    password: Yup.string().min(8, "Too short").required("Required"),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref("password")], "Passwords must match")
      .required("Required"),
    avatar: Yup.mixed().required("Profile picture required"),
  });

  const handleSubmit = async (values, helpers) => {
    const { setSubmitting, setFieldError, setFieldValue } = helpers;

    if (!isEmailVerified) {
      setFieldError("email", "Please verify your email");
      return;
    }

    setSubmitting(true);
    setUploadProgress(20);

    try {
      const imageUrl = await uploadToImgBB(values.avatar, setUploadProgress);

      await register(dispatch, {
        name: values.name.trim(),
        email: values.email.toLowerCase(),
        password: values.password,
        phoneNumber: values.phoneNumber,
        address: values.address,
        imageUrl,
      });

      setUploadProgress(100);
      setTimeout(() => navigate("/login"), 1200);
    } catch (err) {
      setUploadProgress(0);
      setFieldError("general", "Registration failed");
      setAvatarPreview(null);
      setFieldValue("avatar", null);
    } finally {
      setSubmitting(false);
    }
  };

  const isFormReady = useMemo(
    () => isEmailVerified && uploadProgress === 0,
    [isEmailVerified, uploadProgress]
  );

  return (
    <div className="register-container">
      <div className="card-header">
        <h1 className="register-title">Create Account</h1>
        <p className="register-subtitle">Join us today</p>
      </div>
      <Formik
        initialValues={{
          name: "",
          email: "",
          phoneNumber: "",
          address: "",
          password: "",
          confirmPassword: "",
          avatar: null,
        }}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {({ isSubmitting, setFieldValue, values, errors, touched }) => (
          <Form className="register-card">
            {/* LEFT SIDE: Avatar */}
            <div className="register-left">
              <div className="form-group avatar-upload">
                <label className="upload-label">
                  <HiCamera className="upload-icon" />
                  Upload Profile Picture
                  <input
                    type="file"
                    className="file-input"
                    accept="image/*"
                    onChange={(e) => handleAvatarChange(e, setFieldValue)}
                  />
                </label>

                <ErrorMessage
                  name="avatar"
                  component="p"
                  className="error-text"
                />

                {avatarPreview && (
                  <div className="avatar-preview-container">
                    <img
                      src={avatarPreview}
                      alt="avatar"
                      className="avatar-preview"
                    />
                  </div>
                )}

                {uploadProgress > 0 && (
                  <div className="progress-container">
                    <Box sx={{ width: "100%" }}>
                      <LinearProgress
                        variant="determinate"
                        value={uploadProgress}
                      />
                    </Box>
                    <span className="progress-text">{uploadProgress}%</span>
                  </div>
                )}
              </div>
            </div>

            {/* RIGHT SIDE: Form */}
            <div className="register-right">
              {/* Name + Email Verification */}
              <div className="form-row">
                <Field name="name">
                  {({ field }) => (
                    <div className="form-group">
                      <label className="form-label">
                        <HiOutlineUser /> Full Name
                      </label>
                      <input
                        {...field}
                        placeholder="Enter Your Name (John Doe)"
                        className={`form-input ${
                          touched.name && errors.name ? "error" : ""
                        }`}
                      />
                      <ErrorMessage
                        name="name"
                        component="p"
                        className="error-text"
                      />
                    </div>
                  )}
                </Field>

                <EmailVerifyUser
                  onEmailVerified={(verifiedEmail) => {
                    setIsEmailVerified(!!verifiedEmail);
                    setFieldValue("email", verifiedEmail || "");
                  }}
                />
              </div>

              <div className="form-row">
                <Field name="phoneNumber">
                  {({ field }) => (
                    <div className="form-group">
                      <label className="form-label">
                        <HiOutlinePhone /> Phone
                      </label>
                      <input
                        {...field}
                        placeholder="+cc-10digit"
                        className={`form-input ${
                          touched.phoneNumber && errors.phoneNumber
                            ? "error"
                            : ""
                        }`}
                      />
                      <ErrorMessage
                        name="phoneNumber"
                        component="p"
                        className="error-text"
                      />
                    </div>
                  )}
                </Field>

                <Field name="address">
                  {({ field }) => (
                    <div className="form-group">
                      <label className="form-label">
                        <HiLocationMarker /> Address
                      </label>
                      <input
                        {...field}
                        placeholder="Enter Your Address (City, Country)"
                        className={`form-input ${
                          touched.address && errors.address ? "error" : ""
                        }`}
                      />
                      <ErrorMessage
                        name="address"
                        component="p"
                        className="error-text"
                      />
                    </div>
                  )}
                </Field>
              </div>

              <div className="form-row">
                <Field name="password">
                  {({ field }) => (
                    <div className="form-group">
                      <label className="form-label">
                        <HiLockClosed /> Password
                      </label>
                      <input
                        type="password"
                        placeholder="Enter Your Password"
                        {...field}
                        className="form-input"
                      />
                      {values.password && (
                        <PasswordStrengthBar password={values.password} />
                      )}
                      <ErrorMessage
                        name="password"
                        component="p"
                        className="error-text"
                      />
                    </div>
                  )}
                </Field>

                <Field name="confirmPassword">
                  {({ field }) => (
                    <div className="form-group">
                      <label className="form-label">Confirm Password</label>
                      <input
                        type="password"
                        placeholder="Confirm Your Password"
                        {...field}
                        className="form-input"
                      />
                      <ErrorMessage
                        name="confirmPassword"
                        component="p"
                        className="error-text"
                      />
                    </div>
                  )}
                </Field>
              </div>

              {serverError && <div className="server-error">{serverError}</div>}

              <div className="register-btn">
                <button type="submit" disabled={isSubmitting || !isFormReady}>
                  {isSubmitting ? (
                    <>
                      <span className="spinner" /> Creating Account
                    </>
                  ) : (
                    "Create Account"
                  )}
                </button>
              </div>

              {/* Footer */}
              <div className="form-footer">
                <p className="login-text">
                  Already have an account?{" "}
                  <Link to="/login" className="login-link">
                    Sign in
                  </Link>
                </p>
              </div>
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default RegistrationForm;
