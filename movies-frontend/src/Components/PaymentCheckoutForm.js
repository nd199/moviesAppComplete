import React from "react";
import "./PaymentCheckoutForm.css";

const PaymentCheckoutForm = ({
  paymentDetails,
  handlePaymentInputChange,
  handlePaymentCheckout,
  formatCardNumber,
  formatExpiry,
}) => {
  return (
    <div>
      <form onSubmit={handlePaymentCheckout}>
        <div className="paymentPage-left-heading">
          <h2>Payment Details</h2>
        </div>
        <div className="paymentPage-right-content">
          <div className="cards">
            <label>Accepted Transactions</label>
            <img
              src="https://i.ibb.co/Qfvn4z6/payment.png"
              alt="Accepted Cards"
              className="paymentCardImage"
            />
          </div>
          <div className="paymentPage-card-input">
            <label htmlFor="cardNumber">Card Number</label>
            <input
              id="cardNumber"
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
            <label htmlFor="expiry">Expiry</label>
            <input
              id="expiry"
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
            <label htmlFor="cvv">CVV</label>
            <input
              id="cvv"
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
            <label htmlFor="nameOnCard">Name on Card</label>
            <input
              id="nameOnCard"
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
            <label htmlFor="paymentMethod">Payment Method</label>
            <select
              id="paymentMethod"
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
        <button className="paymentPage-checkout-btn" type="submit">
          Checkout
        </button>
      </form>
    </div>
  );
};

export default PaymentCheckoutForm;
