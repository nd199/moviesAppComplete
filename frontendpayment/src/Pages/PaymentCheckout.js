import { Form, Formik } from "formik";
import { useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { v4 as uuid } from "uuid";
import * as Yup from "yup";
import "./PaymentCheckout.css";

import InputField from "../component/InputComponent";
import {
  getPaymentDetails,
  pingSpring,
  saveFinalPayment,
  updateFinalUser,
} from "../Network/ApiCalls";

import "./PaymentCheckout.css";

const PaymentCheckout = () => {
  const dispatch = useDispatch();
  const { userId } = useParams();
  const nav = useNavigate();

  const userAndPaymentData = useSelector(
    (state) => state?.payment?.userInfoAndSelectedPlan
  );

  const userDetails = userAndPaymentData?.data;
  const selectedPlan = userDetails?.selectedPlan?.selectedPlan;

  useEffect(() => {
    getPaymentDetails(dispatch, userId);
  }, [dispatch, userId]);

  const initialValues = useMemo(
    () => ({
      name: userDetails?.name || "",
      address: userDetails?.address || "",
      phoneNumber: userDetails?.phoneNumber || "",
      nameOnCard: "",
      cardNumber: "",
      expiry: "",
      cvv: "",
    }),
    [userDetails]
  );

  const validationSchema = Yup.object({
    name: Yup.string().required("Name is required"),
    address: Yup.string().required("Address is required"),
    phoneNumber: Yup.string()
      .matches(/^\d{10}$/, "Enter valid phone number")
      .required("Phone number required"),
    nameOnCard: Yup.string().required("Cardholder name required"),
    cardNumber: Yup.string()
      .matches(/^(\d{4} ){2,3}\d{4}$/, "Invalid card number")
      .required("Card number required"),
    expiry: Yup.string()
      .matches(/^(0[1-9]|1[0-2])\/\d{2}$/, "MM/YY format")
      .required("Expiry required"),
    cvv: Yup.string()
      .matches(/^\d{3,4}$/, "Invalid CVV")
      .required("CVV required"),
  });

  const handleSubmit = async (values, { setSubmitting }) => {
    const transactionId = uuid();

    try {
      const finalUser = { ...userDetails, ...values };

      const response = await saveFinalPayment(dispatch, {
        finalUser,
        finalPlan: selectedPlan,
        paymentMethod: "card",
        transactionId,
      });

      if (response) {
        finalUser.isSubscribed = true;
        await updateFinalUser(dispatch, finalUser);
        await pingSpring(dispatch, finalUser.email);
        nav("/success");
      }
    } catch (err) {
      alert("Payment failed. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="payment-container">
      <div className="payment-card">
        <h1 className="payment-title">Secure Checkout</h1>

        <Formik
          enableReinitialize
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({ values, handleChange, isSubmitting, isValid }) => (
            <Form>
              <div className="payment-grid">
                <div className="payment-section">
                  <h2>Personal Details</h2>
                  <InputField
                    label="Full Name"
                    name="name"
                    value={values.name}
                    onChange={handleChange}
                    required
                  />

                  <InputField
                    label="Email"
                    value={userDetails?.email || ""}
                    disabled
                  />

                  <InputField
                    label="Billing Address"
                    name="address"
                    value={values.address}
                    onChange={handleChange}
                    required
                  />

                  <InputField
                    label="Phone Number"
                    name="phoneNumber"
                    value={values.phoneNumber}
                    onChange={(e) => {
                      e.target.value = e.target.value
                        .replace(/\D/g, "")
                        .slice(0, 10);
                      handleChange(e);
                    }}
                    required
                  />
                </div>

                {/* PAYMENT */}
                <div className="payment-section">
                  <h2>Payment Method</h2>

                  <InputField
                    label="Cardholder Name"
                    name="nameOnCard"
                    value={values.nameOnCard}
                    onChange={handleChange}
                    required
                  />

                  <InputField
                    label="Card Number"
                    name="cardNumber"
                    value={values.cardNumber}
                    onChange={(e) => {
                      e.target.value = e.target.value
                        .replace(/\D/g, "")
                        .replace(/(.{4})/g, "$1 ")
                        .trim()
                        .slice(0, 19);
                      handleChange(e);
                    }}
                    required
                  />

                  <div className="card-row">
                    <InputField
                      label="Expiry"
                      name="expiry"
                      value={values.expiry}
                      onChange={(e) => {
                        e.target.value = e.target.value
                          .replace(/\D/g, "")
                          .replace(/(\d{2})(\d{0,2})/, "$1/$2")
                          .slice(0, 5);
                        handleChange(e);
                      }}
                      required
                    />

                    <InputField
                      label="CVV"
                      name="cvv"
                      value={values.cvv}
                      onChange={(e) => {
                        e.target.value = e.target.value
                          .replace(/\D/g, "")
                          .slice(0, 4);
                        handleChange(e);
                      }}
                      required
                    />
                  </div>

                  <div className="plan-summary">
                    <strong>{selectedPlan?.name}</strong>
                    <span>₹{selectedPlan?.price}</span>
                  </div>

                  <button
                    type="submit"
                    className={`pay-button ${isSubmitting ? "loading" : ""}`}
                    disabled={!isValid || isSubmitting}
                  >
                    {isSubmitting ? "Processing..." : "Complete Payment"}
                  </button>
                </div>
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
};

export default PaymentCheckout;
