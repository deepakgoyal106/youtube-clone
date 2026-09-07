import jwt from "jsonwebtoken";

// ==========================================
// JWT AUTHENTICATION MIDDLEWARE
// ==========================================

// Protect routes by verifying the JWT sent by the frontend.
const authMiddleware = (req, res, next) => {
    try {
        // Read the Authorization header.
        const authHeader = req.headers.authorization;

        // A protected route must receive an Authorization header.
        if (!authHeader) {
            return res.status(401).json({
                message: "Authentication required"
            });
        }

        // Expect the standard format:
        // Authorization: Bearer <token>
        const [scheme, token] = authHeader.split(" ");

        // Reject incorrectly formatted authorization headers.
        if (scheme !== "Bearer" || !token) {
            return res.status(401).json({
                message: "Invalid authorization format"
            });
        }

        // Verify the token using the secret stored in the environment.
        const decoded = jwt.verify(
            token,
            process.env.JWT_SECRET
        );

        // Store decoded user information on the request.
        // Controllers can then use req.user.userId.
        req.user = decoded;

        // Continue to the protected controller.
        next();
    } catch (error) {
        // Handle expired, invalid, or malformed JWTs.
        console.error("AUTHENTICATION ERROR:", error.message);

        return res.status(403).json({
            message: "Invalid or expired token"
        });
    }
};

export default authMiddleware;