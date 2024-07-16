const mongoose = require('mongoose');
const {Schema} = mongoose;

const SelectedPlanSchema = new Schema({
    id: {type: Number, required: true},
    name: {type: String, required: true},
    price: {type: Number, required: true},
    interval: {type: String, required: true},
    description: {type: String, required: true}
}, {_id: false});

const FinalUserSchema = new Schema({
    _id: {type: String, required: true},
    id: {type: Number, required: true},
    name: {type: String, required: true},
    email: {type: String, required: true},
    roles: {type: [String], required: true},
    phoneNumber: {type: Number, required: true},
    movies: {type: [String], default: []},
    isEmailVerified: {type: Boolean, required: true},
    address: {type: String, required: true},
    isLogged: {type: Boolean, required: true},
    isRegistered: {type: Boolean, required: true},
    imageUrl: {type: String, required: true},
    createdAt: {type: Date, required: true},
    updatedAt: {type: Date, required: true}
}, {_id: false});

const FinalPlanSchema = new Schema({
    id: {type: Number, required: true},
    name: {type: String, required: true},
    price: {type: Number, required: true},
    interval: {type: String, required: true},
    description: {type: String, required: true}
}, {_id: false});

const PaymentSchema = new Schema({
    finalUser: {type: FinalUserSchema, required: true},
    finalPlan: {type: FinalPlanSchema, required: true},
    paymentMethod: {type: String, default: ''},
    transactionId: {type: String, required: true}
}, {timestamps: true});

const PaymentGateway = mongoose.model('Payment', PaymentSchema);

module.exports = PaymentGateway;
