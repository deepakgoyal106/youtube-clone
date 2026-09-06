// Import mongoose
import mongoose from "mongoose";

// Create the structure/schema for a User.
const userSchema = new mongoose.Schema({

    // Username of the user
    username: {
        type: String,
        required: true
    },

    // Email of the user
    email: {
        type: String,
        required: true
    },

    // Password of the user
    password: {
        type: String,
        required: true
    }

});

// Create the User model from our schema.
const User = mongoose.model("User", userSchema);

// Export the model so other files can use it.
export default User;