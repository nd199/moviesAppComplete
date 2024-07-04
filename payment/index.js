const express = require('express');
const app = express();
const port = process.env.PORT || 3008;
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const path = require('path');
const morgan = require('morgan');

dotenv.config();
app.use(express.json());
app.use(morgan('dev'))


mongoose.connect(process.env.MONGODB_URI).then(() => {
    console.log('Connected to MongoDB');
}).catch((err) => {
    console.error('Failed to connect to MongoDB', err);
});



app.get('/', (req, res) => {
    res.send("Hello Naren");
})

app.listen(port, () => {
    console.log("app listening on port " + 'http://localhost:' + port);
})