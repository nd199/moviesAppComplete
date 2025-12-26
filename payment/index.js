require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const morgan = require("morgan");
const cors = require("cors");

const UserPlan = require("./models/UserPlanInfo");
const PaymentGateway = require("./models/Payment");

const app = express();
const PORT = process.env.PORT || 3008;

app.use(express.json());
app.use(cors());
app.use(morgan("dev"));

app.get("/api/payment/intent", async (req, res) => {
  const { token } = req.query;

  if (!token) {
    return res.status(400).json({ message: "Token is required" });
  }

  try {
    const springRes = await axios.get(
      `${SPRING_BASE_URL}/api/v1/subscription/intent/${token}`,
      {
        headers: {
          Authorization: `Bearer ${Service_JWT}`,
        },
      }
    );
    return res.json(springRes.data);
  } catch (err) {
    return res.status(400).json({ message: "Invalid or expired token" });
  }
});

app.post("/updateFinalUser", async (req, res) => {
  try {
    const { finalUser } = req.body;

    if (!finalUser?.email) {
      return res.status(400).json({ message: "Email is required" });
    }

    const payment = await PaymentGateway.findOne({
      "finalUser.email": finalUser.email,
    });

    if (!payment) {
      return res.status(404).json({ message: "User not found" });
    }

    payment.finalUser.isSubscribed = finalUser.isSubscribed;
    await payment.save();

    res.status(200).json(payment);
  } catch (err) {
    res.status(500).json({ message: "Internal server error" });
  }
});

app.post("/api/auth/payment", async (req, res) => {
  try {
    const { currentUser, selectedPlan } = req.body;

    if (!currentUser?.email || !selectedPlan) {
      return res.status(400).json({ message: "Invalid request body" });
    }

    let user = await UserPlan.findOne({ email: currentUser.email });

    if (!user) {
      user = new UserPlan({ ...currentUser, selectedPlan });
    } else {
      user.selectedPlan = selectedPlan;
    }

    await user.save();

    res.status(200).json({
      message: "Payment processed",
      data: user,
    });
  } catch (err) {
    res.status(500).json({ message: "Payment failed" });
  }
});

app.get("/paymentDetails", async (req, res) => {
  try {
    const { email } = req.query;

    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }

    const userPlan = await UserPlan.findOne({ email });

    if (!userPlan) {
      return res.status(404).json({ message: "No plans found" });
    }

    res.status(200).json({
      message: "Payment details",
      data: userPlan,
    });
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch details" });
  }
});

app.post("/submitPayment", async (req, res) => {
  try {
    const { finalPayment } = req.body;

    if (!finalPayment?.finalUser?.email) {
      return res.status(400).json({ message: "Invalid payment data" });
    }

    const email = finalPayment.finalUser.email;

    let payment = await PaymentGateway.findOne({
      "finalUser.email": email,
    });

    if (!payment) {
      payment = new PaymentGateway(finalPayment);
    } else {
      payment.finalUser = finalPayment.finalUser;
      payment.finalPlan = finalPayment.finalPlan;
      payment.paymentMethod = finalPayment.paymentMethod;
      payment.transactionId = finalPayment.transactionId;
    }

    await payment.save();
    res.status(200).json(payment);
  } catch (err) {
    res.status(500).json({ message: "Failed to save payment" });
  }
});

app.get("/", (req, res) => {
  res.status(200).json({ status: "Payment service running" });
});

mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => {
    app.listen(PORT || 8085, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch(() => {
    process.exit(1);
  });
