const express = require("express");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const morgan = require("morgan");
const cors = require("cors");
const UserPlan = require("./models/UserPlanInfo");

const app = express();
const port = process.env.PORT || 3008;

dotenv.config();
app.use(express.json());
app.use(morgan("dev"));
app.use(cors());

app.post("/api/auth/payment", async (req, res) => {
    console.log("Payment request received:", req.body);
    const {currentUser, selectedPlan} = req.body;

    try {
        const existingUser = await UserPlan.findOne({email: currentUser.email});
        const existingPlan =
            existingUser && existingUser.selectedPlan.id === selectedPlan.id;

        if (!existingPlan) {
            const userPlan = new UserPlan({...currentUser, selectedPlan});
            await userPlan.save();
            res.status(200).json({
                message: "Payment Initiated",
                data: {currentUser, selectedPlan},
            });
        } else {
            res.status(200).json({
                message: "User Already Subscribed to Selected Plan",
                data: {currentUser, selectedPlan},
            });
        }
    } catch (error) {
        console.error("Error saving user:", error);
        res.status(500).json({message: "Payment failed", error});
    }
});

app.get("/paymentDetails", async (req, res) => {
    const {userId: id} = req.query;
    try {
        const userPlan = await UserPlan.findOne({id});
        if (!userPlan) {
            res.status(404).json({
                message: "No Plans Found for user",
            });
        }
        res.status(200).json({
            message: "Payment Details",
            data: userPlan,
        });
    } catch (error) {
        console.error("Error saving user:", error);
        res.status(500).json({message: "Payment failed", error});
    }
});

mongoose
    .connect(process.env.MONGODB_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    })
    .then(() => console.log("Connected to MongoDB"))
    .catch((err) => console.error("Failed to connect to MongoDB", err));

app.listen(port, () => {
    console.log(`App listening on port http://localhost:${port}`);
});
