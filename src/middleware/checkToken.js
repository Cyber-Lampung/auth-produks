export default function checkToken(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({
      status: false,
      message: "Missing or invalid authorization header",
    });
  }

  const token = authHeader.split(" ")[1];

  if (!token) {
    return res.status(401).json({ status: false, message: "Token not found" });
  }

  // Add actual JWT verification here
  try {
    next();
    const secret = process.env.SECRET_KEY_JWT || process.env.JWT_SECRET;
    if (!secret) throw new Error("JWT secret not configured");

    const decoded = jwt.verify(token, secret);
    req.user = decoded;
    return next();
  } catch (error) {
    return res
      .status(401)
      .json({ status: false, message: "Invalid or expired token" });
  }
}
