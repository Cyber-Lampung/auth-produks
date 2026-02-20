import createdAdminAcountService from "../../services/auth/adminCreated.service.js";

export default async function createdAdminAccountController(req, res, next) {
  try {
    const { email, username, password } = req.body;

    const resService = await createdAdminAcountService(
      email,
      username,
      password,
    );

    if (resService.status) {
      // cookie
      res.cookie("accessToken", resService.token.resAccessToken, {
        httpOnly: true,
        secure: process.env.DEV || true,
        sameSite: "lax",
        maxAge: 15 * 60 * 1000,
      });

      res.cookie("refreshToken", resService.token.refreshToken, {
        httpOnly: true,
        secure: process.env.DEV || true,
        sameSite: "lax",
        maxAge: 7 * 24 * 60 * 60 * 1000, // => 7 day , 24 jam , 60 menit , 60 detik , 1000 milidetik
        // path: "/dashboard",
      });

      return res
        .status(201)
        .json({ status: true, message: "success created admin account" });
    } else {
      return res.status(400).json({ status: false, message: "bad request" });
    }
  } catch (error) {
    next(error);
    // return res
    //   .status(500)
    //   .json({ status: false, message: "server error", error: error.stack });
  }
}
