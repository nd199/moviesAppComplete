const mongoose = require('mongoose');
const {Mongoose} = require("mongoose");


const PaymentSchema
    = new Mongoose.Schema({
    userId: {type: Number, required: true},
    subscriptionId: {type: Object, required: true},
    paymentType: {type: String, enum: ['subscription', 'rental', 'purchase'], required: true},
    amount: {type: Number, default: 0.00, required: true},
    currency: {type: String, enum: ['INR', 'USD'], default: 0.00, required: true},
    paymentMethod: {type: String, enum: ['CURRENCY', 'CARD'], required: true},
    timestamp: {type: Date, default: Date.now},
    status: {type: String, enum: ['PENDING', 'FAILED', 'COMPLETED'], required: true},
    expiry: {type: Date},
    movieId: {type: Number, required: true},
    transactionId: {type: String, ref: 'Transaction', required: true},
}, {timestamps: true});

const Payment = mongoose.model('Payment', PaymentSchema);

module.exports = Payment;