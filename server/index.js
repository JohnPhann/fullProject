const express = require('express');
const mongoose = require('mongoose');
const authRoute = require('./routes/auth');
require('dotenv').config();
const connectDB = async () => {
    try {
        await mongoose.connect(`mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@learnmern.q2r68lt.mongodb.net/test`)
       console.log("Connect Sussces")
    } catch(err) {
        console.log(err.message)
        process.exit(1)
    }
}
connectDB();

const app = express();
app.use(express.json());



const PORT = 5000;



app.listen(PORT, () => console.log(`Server is runing ${PORT}`));


app.use("/api/auth",authRoute);