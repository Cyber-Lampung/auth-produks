import useServiceCreatedUser from "../../services/auth/useCreatedUser.service.js";

const ACCESS_TOKEN_EXPIRY = 15 * 60 * 1000; // 15 minutes
const REFRESH_TOKEN_EXPIRY = 7 * 24 * 60 * 60 * 1000; // 7 days

export default async function userCreatedController(req, res, next) {
  try {
    // ambil user inputan
    const { email, username, password } = req.body;

    //   kirim inputan ke service
    const resService = await useServiceCreatedUser(email, username, password);

    const isProduction = process.env.NODE_ENV === "production";

    if (!resService || !resService.status) {
      return res
        .status(400)
        .json({
          status: false,
          message: resService?.message || "Failed to create user",
        });
    }

    const COOKIE_OPTIONS = {
      httpOnly: true,
      secure: isProduction,
      sameSite: isProduction ? "strict" : "lax",
      path: "/",
    };

    res.cookie("accessToken", resService.dataSession.resAccessToken, {
      ...COOKIE_OPTIONS,
      maxAge: ACCESS_TOKEN_EXPIRY,
    });

    res.cookie("refreshToken", resService.dataSession.resRefreshToken, {
      ...COOKIE_OPTIONS,
      maxAge: REFRESH_TOKEN_EXPIRY,
    });

    return res
      .status(201)
      .json({ status: true, message: "User created successfully" });
  } catch (error) {
    next(error);
    // return res
    //   .status(500)
    //   .json({ status: false, message: "server error", error: error.stack });
  }
}
