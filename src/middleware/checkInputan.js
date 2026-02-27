/**
 * Validate user input for registration / login
 */
export default function checkInputan(req, res, next) {
  const { email, username, password } = req.body || {};

  const errors = {};

  if (!email) errors.email = "Email is required";
  if (!password) errors.password = "Password is required";

  // For registration routes username may be required
  if (req.path && req.path.includes("created") && !username)
    errors.username = "Username is required";

  if (Object.keys(errors).length > 0) {
    return res
      .status(400)
      .json({ status: false, message: "Validation failed", errors });
  }

  // Basic email format validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res
      .status(400)
      .json({ status: false, message: "Invalid email format" });
  }

  // Username format (if provided)
  if (username && !/^[a-zA-Z0-9_]{3,20}$/.test(username)) {
    return res
      .status(400)
      .json({ status: false, message: "Invalid username format" });
  }

  // Password strength
  if (typeof password !== "string" || password.length < 8) {
    return res.status(400).json({
      status: false,
      message: "Password must be at least 8 characters",
    });
  }

  // Validate username format
  if (!/^[a-zA-Z0-9_]{3,20}$/.test(username)) {
    return res.status(400).json({ status: false, message: "Invalid username" });
  }

  next();
}
