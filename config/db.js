const mongoose = require("mongoose");
require("dotenv").config();

async function connectDatabase() {
    const mongoUri = process.env.MONGODB_URI;
    if (!mongoUri) {
        throw new Error("MONGODB_URI is required");
    }

    mongoose.set("strictQuery", true);

    await mongoose.connect(mongoUri, {
        serverSelectionTimeoutMS: 5000,
    });

    // eslint-disable-next-line no-console
    console.log("MongoDB connected");

    return mongoose.connection;
}

module.exports = {
    connectDatabase
};