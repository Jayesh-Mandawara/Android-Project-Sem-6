const mongoose = require("mongoose");

const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGO_URI);

        console.log(`Connected to DB`);
    } catch (error) {
        console.error("DB Connection Failed:", error.message);
        process.exit(1);
    }
};

module.exports = connectDB;
