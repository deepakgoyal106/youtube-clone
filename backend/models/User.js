// Import mongoose to create the MongoDB User schema and model.
import mongoose from "mongoose";

// Create the structure and validation rules for a User.
const userSchema = new mongoose.Schema({

    // Username displayed throughout the application.
    username: {
        type: String,
        required: [true, "Username is required"],
        trim: true,
        minlength: [3, "Username must be at least 3 characters"],
        maxlength: [30, "Username cannot exceed 30 characters"]
    },

    // Email is used during login and must be unique.
    email: {
        type: String,
        required: [true, "Email is required"],
        trim: true,
        lowercase: true,
        unique: true
    },

    // Password is stored as a bcrypt hash by the authentication controller.
    password: {
        type: String,
        required: [true, "Password is required"],
        minlength: [8, "Password must be at least 8 characters"]
    }

}, {
    // Automatically track when the user account was created or updated.
    timestamps: true
});

// Create the User model from the schema.
const User = mongoose.model("User", userSchema);

// Export the model for authentication controllers and other backend files.
export default User;