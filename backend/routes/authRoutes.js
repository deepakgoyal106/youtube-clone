// Import Express
import express from "express";
import authMiddleware from "../middleware/authMiddleware.js";


// Import our registration controller
import registerUser, { loginUser } from "../controllers/authController.js";

// Create a router
const router = express.Router();

// Registration route
router.post("/register", registerUser);
//Login
router.post("/login", loginUser);

router.get("/profile", authMiddleware, (req, res) => {

    res.status(200).json({
        message: "You are authenticated",
        user: req.user
    });

});

router.get("/me", authMiddleware, (req, res) => {

    res.status(200).json({
        user: req.user
    });

});
// Export the router
export default router;