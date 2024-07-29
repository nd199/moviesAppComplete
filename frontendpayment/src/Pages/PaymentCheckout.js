import "./PaymentCheckout.css";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  getPaymentDetails,
  pingSpring,
  saveFinalPayment,
  updateFinalUser,
} from "../Network/ApiCalls";
import { useNavigate, useParams } from "react-router-dom";
import { v4 as uuid } from "uuid";
import PaymentCheckoutForm from "../component/PaymentCheckoutForm";

const PaymentCheckout = () => {
  const dispatch = useDispatch();
  const { userId } = useParams();

  useEffect(() => {
    const fetchPaymentDetails = async () => {
      try {
        await getPaymentDetails(dispatch, userId);
      } catch (error) {
        alert("Failed to fetch payment details. Please reload the page");
      }
    };
    fetchPaymentDetails();
  }, [dispatch, userId]);

  const userAndPaymentData = useSelector(
    (state) => state?.payment?.userInfoAndSelectedPlan
  );
  const userDetails = userAndPaymentData?.data;
  const selectedPlan = userAndPaymentData?.data?.selectedPlan?.selectedPlan;
  const UUID = uuid();
  const nav = useNavigate();

  const [name, setName] = useState(userDetails?.name || "");
  const [address, setAddress] = useState(userDetails?.address || "");
  const [phoneNumber, setPhoneNumber] = useState(
    userDetails?.phoneNumber || ""
  );
  const [planName, setPlanName] = useState(selectedPlan?.name || "");
  const [planDescription, setPlanDescription] = useState(
    selectedPlan?.description || ""
  );
  const [planPrice, setPlanPrice] = useState(selectedPlan?.price || "");

  const [paymentDetails, setPaymentDetails] = useState({
    cardNumber: "",
    expiry: "",
    cvv: "",
    nameOnCard: "",
    paymentMethod: "",
  });

  const handleUserDetailsChange = (e) => {
    const { name, value } = e.target;
    switch (name) {
      case "name":
        setName(value);
        break;
      case "address":
        setAddress(value);
        break;
      case "phoneNumber":
        setPhoneNumber(value);
        break;
      default:
        break;
    }
  };

  const handlePaymentInputChange = (e) => {
    const { name, value } = e.target;
    setPaymentDetails({ ...paymentDetails, [name]: value });
  };

  const handlePaymentCheckout = async (e) => {
    e.preventDefault();
    const transactionId = UUID;

    const finalUser = {
      ...userDetails,
      name,
      address,
      phoneNumber,
    };

    const finalPlan = {
      ...selectedPlan,
      name: planName,
      description: planDescription,
      price: planPrice,
    };

    try {
      const response = await saveFinalPayment(dispatch, {
        finalUser,
        finalPlan,
        paymentMethod: paymentDetails.paymentMethod,
        transactionId,
      });
      if (response) {
        finalUser.isSubscribed = true;
        console.log("Final user before update:", finalUser);
        try {
          const res = await updateFinalUser(dispatch, finalUser);
          const email = finalUser.email;
          const res2 = await pingSpring(dispatch, email);
          if (res && res2) {
            nav("/success");
          }
        } catch (err) {
          console.error("Failed to update final user:", err);
          alert(
            "Subscription failed. If the amount was deducted, it will be refunded within 4 business days. Please try again."
          );
        }
      }
    } catch (error) {
      console.error("Payment checkout failed:", error);
      alert("Payment checkout failed. Please try again.");
    }
  };

  const formatCardNumber = (cardNumber) => {
    const digitsOnly = cardNumber.replace(/\D/g, "");
    return digitsOnly.replace(/(.{4})/g, "$1-").slice(0, 19);
  };

  const formatExpiry = (expiry) => {
    const formattedExpiry = expiry
      .replace(/\D/g, "")
      .replace(/(\d{2})(\d{0,4})/, "$1/$2");
    return formattedExpiry.slice(0, 5);
  };

  return (
    <div className="paymentPage-container">
      <div className="paymentPage-card">
        <div className="paymentPage-header">
          <div className="paymentPage-title">Checkout</div>
          <div className="paymentPage-description">
            Please check your details below before checkout
          </div>
        </div>
        <div className="paymentPage-content">
          <div className="paymentPage-left">
            <div className="paymentPage-left-top">
              <div className="paymentPage-left-heading">
                <h2>Your Details</h2>
                <img
                  src={userDetails?.imageUrl}
                  alt="Your Profile"
                  className="paymentPage-profile-img"
                />
              </div>
              <p className="paymentPage-instructions" style={{margin:"20px", color: "#fff"}}>
                Check your details. You can edit them except your email and
                plan.
              </p>
              <div className="paymentPage-left-content">
                <div className="paymentPage-input">
                  <label htmlFor="name">Your Name</label>
                  <input
                    id="name"
                    type="text"
                    name="name"
                    value={name}
                    onChange={handleUserDetailsChange}
                    required
                  />
                </div>
                <div className="paymentPage-input">
                  <label htmlFor="email">Your Email</label>
                  <input
                    id="email"
                    type="email"
                    value={userDetails?.email}
                    style={{ cursor: "not-allowed" }}
                    disabled
                  />
                </div>
                <div className="paymentPage-input">
                  <label htmlFor="address">Your Billing Address</label>
                  <input
                    id="address"
                    type="text"
                    name="address"
                    value={address}
                    onChange={handleUserDetailsChange}
                    required
                  />
                </div>
                <div className="paymentPage-input">
                  <label htmlFor="phoneNumber">Your Phone</label>
                  <input
                    id="phoneNumber"
                    type="text"
                    name="phoneNumber"
                    value={phoneNumber}
                    onChange={handleUserDetailsChange}
                    required
                  />
                </div>
              </div>
            </div>
            <div className="paymentPage-left-bottom">
              <div className="paymentPage-left-heading">
                <h2>Your Plan Details</h2>
              </div>
              <div className="paymentPage-left-content">
                <div className="paymentPage-input">
                  <label htmlFor="planName">Your Plan Name</label>
                  <input
                    id="planName"
                    type="text"
                    value={planName}
                    onChange={(e) => setPlanName(e.target.value)}
                    disabled
                  />
                </div>
                <div className="paymentPage-input">
                  <label htmlFor="planDescription">Your Plan Description</label>
                  <input
                    id="planDescription"
                    type="text"
                    value={planDescription}
                    onChange={(e) => setPlanDescription(e.target.value)}
                    disabled
                  />
                </div>
                <div className="paymentPage-input">
                  <label htmlFor="planPrice">Your Plan Price (In Rupees)</label>
                  <input
                    id="planPrice"
                    type="text"
                    value={planPrice}
                    onChange={(e) => setPlanPrice(e.target.value)}
                    disabled
                  />
                </div>
              </div>
            </div>
          </div>
          <div className="paymentPage-right">
            <div className="paymentPage-right-top">
              <PaymentCheckoutForm
                paymentDetails={paymentDetails}
                handlePaymentInputChange={handlePaymentInputChange}
                handlePaymentCheckout={handlePaymentCheckout}
                formatCardNumber={formatCardNumber}
                formatExpiry={formatExpiry}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentCheckout;
