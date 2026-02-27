import jwt from "jsonwebtoken";
import generateUUID from "./generateUUID.js";

export default function createdAuthorization() {
  const accessToken = async (user_id, role) => {
    const payload = {
      user_id: user_id,
      role: role,
    };

    const token = await jwt.sign(payload, process.env.SECRET_KEY_JWT, {
      algorithm: "HS256",
      expiresIn: "15M",
    });

    return token;
  };

  const refreshToken = async () => {
    const refreshToken = await generateUUID();

    return refreshToken;
  };

  return { accessToken, refreshToken };
}
