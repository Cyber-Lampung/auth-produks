import express from "express";
import validasiAuthrozationToken from "../../middleware/testing-api/valdasiAuthorization.js";
import db from "../../config/db.config.js";
import jwt from "jsonwebtoken";

const router = express.Router();

router.post("/testing/token", validasiAuthrozationToken);

router.post("/testing/revoke/token/accessToken", async (req, res, next) => {
  try {
    const refreshToken = req.cookies.refreshToken;

    const [resQuery] = await db.query(
      "select users.user_id, users.role from users inner join sessions on users.user_id = sessions.user_id where refreshToken = ? ",
      [refreshToken],
    );

    const payload = {
      user_id: resQuery[0].user_id,
      role: resQuery[0].role,
    };

    // create jwt baru
    const jwtBaru = jwt.sign(payload, process.env.SECRET_KEY_JWT, {
      algorithm: "HS256",
      expiresIn: "15M",
    });

    console.log("jwt baru", jwtBaru);

    res.cookie("accessToken", jwtBaru, {
      httpOnly: true,
      secure: false, // dev
      sameSite: "lax",
      maxAge: 15 * 60 * 1000,
      // path: "/dashboard",
    });

    return res
      .status(201)
      .json({ status: true, message: "succes created new sessions" });
  } catch (error) {
    next(error);
  }
});

export default router;
