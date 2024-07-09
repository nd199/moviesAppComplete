import './PaymentCheckout.css';
import React, {useEffect, useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {getPaymentDetails} from '../Network/ApiCalls';
import {useParams} from 'react-router-dom';

const PaymentCheckout = () => {
    const userAndPaymentData = useSelector(state => state?.payment?.userInfoAndSelectedPlan);
    const userDetails = userAndPaymentData?.data;
    const selectedPlan = userAndPaymentData?.data.selectedPlan;
    const dispatch = useDispatch();
    const {userId} = useParams();

    const [name, setName] = useState(userDetails.name);
    const [address, setAddress] = useState(userDetails.address);
    const [phoneNumber, setPhoneNumber] = useState(userDetails.phoneNumber);
    const [planName, setPlanName] = useState(selectedPlan.name);
    const [planDescription, setPlanDescription] = useState(selectedPlan.description);
    const [planPrice, setPlanPrice] = useState(selectedPlan.price);

    const [paymentDetails, setPaymentDetails] = useState({
        cardNumber: '',
        expiry: '',
        cvv: '',
        nameOnCard: '',
        paymentMethod: '',
    });

    useEffect(() => {
        userId && getPaymentDetails(dispatch, userId);
    }, [dispatch, userId]);

    const handleUserDetailsChange = (e) => {
        const {name, value} = e.target;
        switch (name) {
            case 'name':
                setName(value);
                break;
            case 'address':
                setAddress(value);
                break;
            case 'phoneNumber':
                setPhoneNumber(value);
                break;
            default:
                break;
        }
    };

    const handlePaymentInputChange = (e) => {
        const {name, value} = e.target;
        setPaymentDetails({...paymentDetails, [name]: value});
    };

    const handlePaymentCheckout = () => {
        // TODO: Implement your payment checkout logic here
        // This could involve sending data to a payment gateway or processing the payment
        console.log('Processing payment with details:', {...userDetails, ...paymentDetails});
    };

    const formatCardNumber = (cardNumber) => {
        // Format card number to display with dashes (e.g., 0000-0000-0000-0000)
        const formattedCardNumber = cardNumber.replace(/\D/g, '').replace(/(.{4})/g, '$1-');
        return formattedCardNumber.substring(0, 19); // Limit to 19 characters
    };

    const formatExpiry = (expiry) => {
        // Format expiry date to MM/YY format
        const formattedExpiry = expiry.replace(/\D/g, '').replace(/(\d{2})(\d{0,4})/, '$1/$2');
        return formattedExpiry.substring(0, 5); // Limit to MM/YY format
    };

    return (
        <div className="paymentPage-container">
            <div className="paymentPage-card">
                <div className="paymentPage-header">
                    <div className="paymentPage-title">Checkout</div>
                    <div className="paymentPage-description">Please check your details below before checkout</div>
                </div>
                <div className="paymentPage-content">
                    <div className="paymentPage-left">
                        <div className="paymentPage-left-top">
                            <div className="paymentPage-left-heading">
                                <h2>Your Details</h2>
                                <img src={userDetails.imageUrl} alt="yourProfile.jpg"
                                     className="paymentPage-profile-img"/>
                            </div>
                            <p style={{margin: "10px auto", color: "white", fontWeight: 300, textAlign: "right"}}>Check
                                your details. You can edit them except your email.</p>
                            <div className="paymentPage-left-content">
                                <div className="paymentPage-input">
                                    <label>Your Name</label>
                                    <input
                                        type="text"
                                        name="name"
                                        value={name}
                                        onChange={handleUserDetailsChange}
                                    />
                                </div>
                                <div className="paymentPage-input">
                                    <label>Your Email</label>
                                    <input
                                        type="email"
                                        value={userDetails.email}
                                        style={{cursor: "not-allowed"}}
                                        disabled
                                    />
                                </div>
                                <div className="paymentPage-input">
                                    <label>Your Billing Address</label>
                                    <input
                                        type="text"
                                        name="address"
                                        value={address}
                                        onChange={handleUserDetailsChange}
                                    />
                                </div>
                                <div className="paymentPage-input">
                                    <label>Your Phone</label>
                                    <input
                                        type="text"
                                        name="phoneNumber"
                                        value={phoneNumber}
                                        onChange={handleUserDetailsChange}
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
                                    <label>Your Plan Name</label>
                                    <input
                                        type="text"
                                        value={planName}
                                        onChange={(e) => setPlanName(e.target.value)}
                                    />
                                </div>
                                <div className="paymentPage-input">
                                    <label>Your Plan Description</label>
                                    <input
                                        type="text"
                                        value={planDescription}
                                        onChange={(e) => setPlanDescription(e.target.value)}
                                    />
                                </div>
                                <div className="paymentPage-input">
                                    <label>Your Plan Price (In Rupees)</label>
                                    <input
                                        type="text"
                                        value={planPrice}
                                        onChange={(e) => setPlanPrice(e.target.value)}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="paymentPage-right">
                        <div className="paymentPage-right-top">
                            <div className="paymentPage-left-heading">
                                <h2>Payment Details</h2>
                            </div>
                            <div className="paymentPage-right-content">
                                <div className="cards">
                                    <label>Accepted Cards</label>
                                    <img src="https://i.ibb.co/Qfvn4z6/payment.png" alt=""
                                         className="paymentCardImage"/>
                                </div>
                                <div className="paymentPage-card-input">
                                    <label>Card Number</label>
                                    <input
                                        type="text"
                                        name="cardNumber"
                                        value={formatCardNumber(paymentDetails.cardNumber)}
                                        onChange={handlePaymentInputChange}
                                        maxLength="19"
                                        placeholder="Enter card number"
                                        required
                                    />
                                </div>
                                <div className="paymentPage-card-input">
                                    <label>Expiry</label>
                                    <input
                                        type="text"
                                        name="expiry"
                                        value={formatExpiry(paymentDetails.expiry)}
                                        onChange={handlePaymentInputChange}
                                        maxLength="5"
                                        placeholder="MM/YY"
                                        required
                                    />
                                </div>
                                <div className="paymentPage-card-input">
                                    <label>CVV</label>
                                    <input
                                        type="password"
                                        name="cvv"
                                        value={paymentDetails.cvv}
                                        onChange={handlePaymentInputChange}
                                        pattern="[0-9]{3}"
                                        maxLength="3"
                                        placeholder="CVV"
                                        required
                                    />
                                </div>
                                <div className="paymentPage-card-input">
                                    <label>Name on Card</label>
                                    <input
                                        type="text"
                                        name="nameOnCard"
                                        value={paymentDetails.nameOnCard}
                                        onChange={handlePaymentInputChange}
                                        maxLength="50"
                                        placeholder="Name on Card"
                                        required
                                    />
                                </div>
                                <div className="paymentPage-card-input">
                                    <label>Payment Method</label>
                                    <select
                                        name="paymentMethod"
                                        value={paymentDetails.paymentMethod}
                                        onChange={handlePaymentInputChange}
                                        required
                                    >
                                        <option value="">Select Payment Method</option>
                                        <option value="creditCard">Credit Card</option>
                                        <option value="debitCard">Debit Card</option>
                                        <option value="netBanking">Net Banking</option>
                                    </select>
                                </div>
                            </div>
                        </div>
                        <button className="paymentPage-checkout-btn" onClick={handlePaymentCheckout}>Proceed to
                            Checkout
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PaymentCheckout;
