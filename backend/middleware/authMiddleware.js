import jwt from "jsonwebtoken";

const authMiddleware = (req, res, next) => {

    // Get the Authorization header
    const authHeader = req.headers.authorization;

    // Check if Authorization header exists
    if (!authHeader) {
        return res.status(401).json({
            message: "Authentication required"
        });
    }

    // Example:
    // Authorization: Bearer eyJhbGciOiJIUzI1...
    const token = authHeader.split(" ")[1];

    // Check if token exists
    if (!token) {
        return res.status(401).json({
            message: "Token required"
        });
    }

    // Verify the JWT using the secret from .env
    jwt.verify(
        token,
        process.env.JWT_SECRET,
        (error, decoded) => {

            // Token is invalid or expired
            if (error) {
                return res.status(403).json({
                    message: "Invalid or expired token"
                });
            }

            // Store decoded user information in request
            req.user = decoded;

            // Continue to the next middleware/route
            next();
        }
    );
};

export default authMiddleware;