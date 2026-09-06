// Import Express.
// Express is a Node.js framework that helps us create
// our web server and APIs.
import express from "express";
import connectDB from "./config/db.js";
// Import authentication routes
import authRoutes from "./routes/authRoutes.js";
//import channels
import channelRoutes from "./routes/channelRoutes.js";
//commentroutes
import commentRoutes from "./routes/commentRoutes.js";

import cors from "cors";

import dotenv from "dotenv";

dotenv.config();

// Create an Express application.
// "app" will be used to create routes and middleware.
const app = express();
// Port on which our backend server will run.
const PORT = 5050;

import videoRoutes from "./routes/videoRoutes.js";


// ===============================
// MIDDLEWARE
// ===============================

// This middleware runs for every incoming request.
app.use((req, res, next) => {

    // Show the HTTP method and URL in the terminal.
    console.log(req.method, req.url);

    // Tell Express to continue to the next step.
    next();
});
app.use(cors({
    origin: "http://localhost:5173",
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"]
}));

// Allows Express to read JSON data
// sent by the frontend in the request body.
app.use(express.json());
//use channels
app.use("/api/channels", channelRoutes);



app.get("/", (req, res) => {

    // Send a simple response to the client.
    res.send("YouTube Clone API is running");
});

connectDB();
// Connect authentication routes
app.use("/api/auth", authRoutes);

app.use("/api/comments", commentRoutes);

//video
app.use("/api/videos", videoRoutes);

// app.listen() starts our Express server.
app.listen(PORT, () => {

    // This message will appear in the terminal
    // when the server starts successfully.
    console.log(`Server running on port ${PORT}`);
});