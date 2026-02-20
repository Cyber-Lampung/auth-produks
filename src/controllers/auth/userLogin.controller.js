import useServiceUserLogin from "../../services/auth/useLoginUser.service.js";

export default async function userLoginController(req, res, next) {
  try {
    const { email, password } = req.body;

    const resService = await useServiceUserLogin(email, password);

    if (resService.status) {
      res.cookie("accessToken", resService.sessions.resAccessToken, {
        httpOnly: true,
        secure: false, // dev
        sameSite: "lax",
        maxAge: 15 * 60 * 1000,
        // path: "/dashboard",
      });

      res.cookie("refreshToken", resService.sessions.resRefreshToken, {
        httpOnly: true,
        secure: false, // dev
        sameSite: "lax",
        maxAge: 7 * 24 * 60 * 60 * 1000,
        // path: "/dashboard",
      });

      return res
        .status(200)
        .json({ status: true, message: resService.message });
    } else {
      return res
        .status(404)
        .json({ status: false, message: resService.message });
    }
  } catch (error) {
    next(error);
    // return res
    //   .status(500)
    //   .json({ status: false, message: "server error", error: error.stack });
  }
}
