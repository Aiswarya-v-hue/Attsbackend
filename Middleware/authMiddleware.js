
const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {
    const authHeader = req.headers.authorization;
    console.log("Received Token:", authHeader);

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).json({ error: "❌ Access denied, token missing or invalid format" });
    }

    const token = authHeader.split(" ")[1];

    try {
        const decoded = jwt.verify(token, 'your_secret_key'); // Make sure this matches your login/signup

        // Attach user info from token to request
        req.user = {
            userId: decoded.userId, // Assuming your token payload contains userId
            email: decoded.email    // Optional: add any other user info here
        };

        next();
    } catch (err) {
        console.error("❌ JWT Verification Error:", err.message);
        return res.status(403).json({ error: "❌ Invalid or expired token" });
    }
};

module.exports = authMiddleware;
