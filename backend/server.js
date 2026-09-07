// Import Express to create the backend server and API routes.
import express from "express";

// Import MongoDB connection function.
import connectDB from "./config/db.js";

// Import CORS so the React frontend can communicate with the backend.
import cors from "cors";

// Import dotenv to load environment variables from .env.
import dotenv from "dotenv";

// Import application routes.
import authRoutes from "./routes/authRoutes.js";
import channelRoutes from "./routes/channelRoutes.js";
import videoRoutes from "./routes/videoRoutes.js";
import commentRoutes from "./routes/commentRoutes.js";

dotenv.config();

// Create the Express application.
const app = express();

// Backend server port.
const PORT = 5050;


// ===============================
// MIDDLEWARE
// ===============================

// Log every incoming request.
// This is useful during development and debugging.
app.use((req, res, next) => {
    console.log(`${req.method} ${req.url}`);
    next();
});

// Allow the React frontend to access the backend API.
app.use(
    cors({
        origin: "http://localhost:5173",
        methods: ["GET", "POST", "PUT", "DELETE"],
        allowedHeaders: ["Content-Type", "Authorization"]
    })
);

// Allow Express to read JSON request bodies.
app.use(express.json());


// ===============================
// API ROUTES
// ===============================

// Authentication routes.
app.use("/api/auth", authRoutes);

// Channel routes.
app.use("/api/channels", channelRoutes);

// Video routes.
app.use("/api/videos", videoRoutes);

// Comment routes.
app.use("/api/comments", commentRoutes);


// ===============================
// HEALTH CHECK
// ===============================

// Simple route used to confirm that the API is running.
app.get("/", (req, res) => {
    res.status(200).json({
        message: "YouTube Clone API is running"
    });
});


// ===============================
// 404 HANDLER
// ===============================

// Handle requests to API routes that do not exist.
// This prevents Express from returning an unclear default response.
app.use((req, res) => {
    res.status(404).json({
        message: `Route not found: ${req.method} ${req.originalUrl}`
    });
});


// ===============================
// ERROR HANDLER
// ===============================

// Centralized error handler for unexpected server errors.
app.use((error, req, res, next) => {
    console.error("SERVER ERROR:", error);

    res.status(500).json({
        message: "Internal server error"
    });
});


// ===============================
// DATABASE + SERVER
// ===============================

// Connect to MongoDB before starting the API server.
connectDB();

// Start the Express server.
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});