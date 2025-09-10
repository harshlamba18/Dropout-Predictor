import jwt from "jsonwebtoken";

export const authMiddleware = (req, res, next) => {
  // Get the token from the Authorization header, which is typically in the format "Bearer <token>"
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "No token provided, authorization denied." });
  }

  try {
    // Extract the token from the "Bearer <token>" string
    const token = authHeader.split(" ")[1];

    // Verify the token using the secret key from your .env file
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Attach the decoded user payload to the request object
    // so that subsequent route handlers can access it
    req.user = decoded;

    // Call the next middleware or route handler in the chain
    next();
  } catch (err) {
    console.error("Token verification failed:", err.message);
    res.status(401).json({ message: "Token is not valid." });
  }
};
