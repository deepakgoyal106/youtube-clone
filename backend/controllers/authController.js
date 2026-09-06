import User from "../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const registerUser = (req, res) => {

    // Get data from the request body
    const { username, email, password } = req.body;

    // Check that all required fields were provided
    if (!username || !email || !password) {
        return res.status(400).json({
            message: "Username, email and password are required"
        });
    }

    // Check if email format is valid
    if (!email.includes("@")) {
        return res.status(400).json({
            message: "Please enter a valid email"
        });
    }

    // Check minimum password length
    if (password.length < 8) {
        return res.status(400).json({
            message: "Password must be at least 8 characters"
        });
    }

    // Check if email already exists
    User.findOne({ email: email })
        .then((existingUser) => {

            if (existingUser) {
                return res.status(400).json({
                    message: "Email already registered"
                });
            }

            // Hash the password
            bcrypt.hash(password, 10)
                .then((hashedPassword) => {

                    // Create a new user
                    const newUser = new User({
                        username: username,
                        email: email,
                        password: hashedPassword
                    });

                    // Save user into MongoDB
                    newUser.save()
                        .then(() => {

                            console.log(
                                "User saved successfully"
                            );

                            res.status(201).json({
                                message:
                                    "User registered successfully"
                            });

                        })
                        .catch((error) => {

                            console.log(
                                "Error saving user:",
                                error
                            );

                            res.status(500).json({
                                message:
                                    "Failed to save user"
                            });

                        });

                })
                .catch((error) => {

                    console.log(
                        "Error hashing password:",
                        error
                    );

                    res.status(500).json({
                        message:
                            "Password hashing failed"
                    });

                });

        })
        .catch((error) => {

            console.log(
                "Database error:",
                error
            );

            res.status(500).json({
                message: "Server error"
            });

        });
};


const loginUser = (req, res) => {

    // Get email and password from request body
    const { email, password } = req.body;

    // Check that both fields were provided
    if (!email || !password) {
        return res.status(400).json({
            message:
                "Email and password are required"
        });
    }

    // Find user by email
    User.findOne({ email: email })
        .then((user) => {

            // If no user was found
            if (!user) {
                return res.status(401).json({
                    message:
                        "Invalid email or password"
                });
            }

            // Compare entered password with hashed password
            bcrypt.compare(password, user.password)
                .then((isMatch) => {

                    // Password does not match
                    if (!isMatch) {
                        return res.status(401).json({
                            message:
                                "Invalid email or password"
                        });
                    }

                    // Create JWT token
                    const token = jwt.sign(
                        {
                            userId: user._id,
                            username: user.username
                        },
                        process.env.JWT_SECRET,
                        {
                            expiresIn: "1d"
                        }
                    );

                    // Send token and basic user information
                    res.status(200).json({
                        message: "Login successful",
                        token: token,
                        user: {
                            id: user._id,
                            username: user.username,
                            email: user.email
                        }
                    });

                })
                .catch((error) => {

                    console.log(
                        "Password comparison error:",
                        error
                    );

                    res.status(500).json({
                        message: "Server error"
                    });

                });

        })
        .catch((error) => {

            console.log(
                "Database error:",
                error
            );

            res.status(500).json({
                message: "Server error"
            });

        });
};


export { loginUser };

export default registerUser;