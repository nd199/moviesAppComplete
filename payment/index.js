const express = require('express');
const app = express();
const port = process.env.PORT || 3008;
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const morgan = require('morgan');
const cors = require('cors');

dotenv.config();
app.use(express.json());
app.use(morgan('dev'));
app.use(cors());

mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
    .then(() => console.log('Connected to MongoDB'))
    .catch((err) => console.error('Failed to connect to MongoDB', err));

app.get('/payment', (req, res) => {
    res.send("Hello Naren");
});

app.post("/login", (req, res) => {
    res.send("Hello Naren");
});

app.post("/payment", (req, res) => {
    console.log('Payment request received:', req.body);
    const {currentUser, selectedPlan} = req.body;
    res.status(200).json({message: "Payment successful", data: {currentUser, selectedPlan}});
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack); // Log the error stack
    res.status(500).send('Something broke!');
});

// Start the server
app.listen(port, () => {
    console.log(`App listening on port http://localhost:${port}`);
});
