import useServiceLogoutUser from "../../services/auth/useLogoutUser.service.js";

export default async function useLogoutUserController(req, res, next) {
  try {
    const refreshToken = req.token;

    const resService = await useServiceLogoutUser(refreshToken);

    if (resService.status) {
      res.clearCookie("refreshToken");
      res.clearCookie("accessToken");

      return res
        .status(200)
        .json({ status: true, message: resService.message });
    }
  } catch (error) {
    next(error);
    // return res
    //   .status(500)
    //   .json({ status: false, message: "server error", error: error });
  }
}
