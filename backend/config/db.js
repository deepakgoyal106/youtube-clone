import mongoose from "mongoose";

const connectDB = () => {

    mongoose.connect("mongodb://127.0.0.1:27017/youtube_clone")
        .then(() => {
            console.log("MongoDB connected successfully");
        })
        .catch((error) => {
            console.error("MongoDB connection failed:", error.message);
        });
};

export default connectDB;