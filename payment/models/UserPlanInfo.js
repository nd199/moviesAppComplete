const mongoose = require("mongoose");

const UserPlanSchema = new mongoose.Schema({
  id: Number,
  name: String,
  email: String,
  roles: [String],
  phoneNumber: Number,
  movies: [String],
  isEmailVerified: Boolean,
  address: String,
  isLogged: Boolean,
  isRegistered: Boolean,
  imageUrl: String,
  createdAt: Date,
  updatedAt: Date,
  selectedPlan: {
    id: Number,
    name: String,
    price: Number,
    interval: String,
    description: String,
  },
});

const UserPlan = mongoose.model("UserPlan", UserPlanSchema);

module.exports = UserPlan;
