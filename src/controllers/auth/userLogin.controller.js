import useServiceUserLogin from "../../services/auth/useLoginUser.service.js";

export default async function userLoginController(req, res, next) {
  try {
    const { email, password } = req.body;

    const resService = await useServiceUserLogin(email, password);

    const isProduction = process.env.NODE_ENV === "production";
    if (!resService || !resService.status) {
      return res
        .status(401)
        .json({
          status: false,
          message: resService?.message || "Invalid credentials",
        });
    }

    const COOKIE_OPTIONS = {
      httpOnly: true,
      secure: isProduction,
      sameSite: isProduction ? "strict" : "lax",
      path: "/",
    };

    const ACCESS_TOKEN_EXPIRY = 15 * 60 * 1000;
    const REFRESH_TOKEN_EXPIRY = 7 * 24 * 60 * 60 * 1000;

    res.cookie("accessToken", resService.sessions.resAccessToken, {
      ...COOKIE_OPTIONS,
      maxAge: ACCESS_TOKEN_EXPIRY,
    });

    res.cookie("refreshToken", resService.sessions.resRefreshToken, {
      ...COOKIE_OPTIONS,
      maxAge: REFRESH_TOKEN_EXPIRY,
    });

    return res.status(200).json({ status: true, message: resService.message });
  } catch (error) {
    next(error);
    // return res
    //   .status(500)
    //   .json({ status: false, message: "server error", error: error.stack });
  }
}
