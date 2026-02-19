import useSeviceCreatedUser from "../../services/auth/useCreatedUser.service.js";

export default async function userCreatedController(req, res, next) {
  try {
    // ambil user inputan
    const { email, username, password } = req.body;

    //   kirim inputan ke service

    const resService = await useSeviceCreatedUser(email, username, password);

    if (resService.status) {
      res.cookie("accessToken", resService.dataSession.resAccessToken, {
        httpOnly: true,
        secure: false,
        sameSite: "lax",
        maxAge: 15 * 60 * 1000,
        // path: "/dashboard",
      });

      res.cookie("refreshToken", resService.dataSession.resRefreshToken, {
        httpOnly: true,
        secure: true,
        sameSite: "lax",
        maxAge: 7 * 24 * 60 * 60 * 1000, // => 7 day , 24 jam , 60 menit , 60 detik , 1000 milidetik
        // path: "/dashboard",
      });

      return res
        .status(201)
        .json({ status: true, message: "success created users" });
    }
  } catch (error) {
    next(error);
    // return res
    //   .status(500)
    //   .json({ status: false, message: "server error", error: error.stack });
  }
}
