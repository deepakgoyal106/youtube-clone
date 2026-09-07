import mongoose from "mongoose";

// Connect the application to the local MongoDB database.
const connectDB = async () => {
    try {
        // Wait for MongoDB to establish a connection before continuing.
        await mongoose.connect(process.env.MONGO_URI);

        console.log("MongoDB connected successfully");
    } catch (error) {
        // Log a clear error message when the database connection fails.
        console.error(
            "MongoDB connection failed:",
            error.message
        );

        // Stop the server because the application requires MongoDB.
        process.exit(1);
    }
};

export default connectDB;