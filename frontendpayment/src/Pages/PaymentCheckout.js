import { Form, Formik } from "formik";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { v4 as uuid } from "uuid";
import * as Yup from "yup";

import {
  fetchUserInfoAndPlan,
  pingSpring,
  savePayment,
  updateFinalUser,
} from "../redux/PaymentRedux";

const PaymentCheckout = () => {
  const dispatch = useDispatch();
  const nav = useNavigate();
  const { userId } = useParams();

  const { userInfoAndSelectedPlan, loading } = useSelector(
    (state) => state.payment
  );

  const user = userInfoAndSelectedPlan?.data;
  const plan = user?.selectedPlan?.selectedPlan;

  useEffect(() => {
    dispatch(fetchUserInfoAndPlan(userId));
  }, [dispatch, userId]);

  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      const transactionId = uuid();

      const finalUser = {
        ...user,
        ...values,
        isSubscribed: true,
      };

      await dispatch(
        savePayment({
          finalUser,
          finalPlan: plan,
          paymentMethod: "card",
          transactionId,
        })
      ).unwrap();

      await dispatch(updateFinalUser(finalUser)).unwrap();

      await dispatch(pingSpring(finalUser.email));

      nav("/success");
    } catch (err) {
      alert(err || "Payment failed");
    } finally {
      setSubmitting(false);
    }
  };

  /* VALIDATION */
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

  if (loading || !user) return <p>Loading...</p>;

  return (
    <div className="payment-container">
      <div className="payment-card">
        <h1>Secure Checkout</h1>

        <Formik
          enableReinitialize
          initialValues={{
            name: user.name || "",
            address: user.address || "",
            phoneNumber: user.phoneNumber || "",
            nameOnCard: "",
            cardNumber: "",
            expiry: "",
            cvv: "",
          }}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({
            values,
            errors,
            touched,
            handleChange,
            handleBlur,
            isSubmitting,
            isValid,
          }) => (
            <Form>
              {/* PERSONAL DETAILS */}
              <h3>Personal Details</h3>

              <input
                name="name"
                placeholder="Full Name"
                value={values.name}
                onChange={handleChange}
                onBlur={handleBlur}
              />
              {touched.name && errors.name && <p>{errors.name}</p>}

              <input value={user.email} disabled placeholder="Email" />

              <input
                name="address"
                placeholder="Billing Address"
                value={values.address}
                onChange={handleChange}
                onBlur={handleBlur}
              />
              {touched.address && errors.address && <p>{errors.address}</p>}

              <input
                name="phoneNumber"
                placeholder="Phone Number"
                value={values.phoneNumber}
                onChange={(e) => {
                  e.target.value = e.target.value
                    .replace(/\D/g, "")
                    .slice(0, 10);
                  handleChange(e);
                }}
                onBlur={handleBlur}
              />
              {touched.phoneNumber && errors.phoneNumber && (
                <p>{errors.phoneNumber}</p>
              )}

              {/* PAYMENT */}
              <h3>Payment Details</h3>

              <input
                name="nameOnCard"
                placeholder="Name on Card"
                value={values.nameOnCard}
                onChange={handleChange}
                onBlur={handleBlur}
              />
              {touched.nameOnCard && errors.nameOnCard && (
                <p>{errors.nameOnCard}</p>
              )}

              <input
                name="cardNumber"
                placeholder="Card Number"
                value={values.cardNumber}
                onChange={(e) => {
                  e.target.value = e.target.value
                    .replace(/\D/g, "")
                    .replace(/(.{4})/g, "$1 ")
                    .trim()
                    .slice(0, 19);
                  handleChange(e);
                }}
                onBlur={handleBlur}
              />
              {touched.cardNumber && errors.cardNumber && (
                <p>{errors.cardNumber}</p>
              )}

              <input
                name="expiry"
                placeholder="MM/YY"
                value={values.expiry}
                onChange={(e) => {
                  e.target.value = e.target.value
                    .replace(/\D/g, "")
                    .replace(/(\d{2})(\d{0,2})/, "$1/$2")
                    .slice(0, 5);
                  handleChange(e);
                }}
                onBlur={handleBlur}
              />
              {touched.expiry && errors.expiry && <p>{errors.expiry}</p>}

              <input
                name="cvv"
                placeholder="CVV"
                value={values.cvv}
                onChange={(e) => {
                  e.target.value = e.target.value
                    .replace(/\D/g, "")
                    .slice(0, 4);
                  handleChange(e);
                }}
                onBlur={handleBlur}
              />
              {touched.cvv && errors.cvv && <p>{errors.cvv}</p>}

              {/* SUMMARY */}
              <div className="plan-summary">
                <strong>{plan?.name}</strong>
                <span>₹{plan?.price}</span>
              </div>

              <button type="submit" disabled={!isValid || isSubmitting}>
                {isSubmitting ? "Processing..." : "Complete Payment"}
              </button>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
};

export default PaymentCheckout;
