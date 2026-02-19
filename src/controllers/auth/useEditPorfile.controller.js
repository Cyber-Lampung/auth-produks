import useEditPorfileService from "../../services/auth/useEditProfile.service.js";

export default async function useEditprofileController(req, res, next) {
  try {
    const { email, username, password } = req.body;
    const refreshToken = req.token;

    const resService = await useEditPorfileService(
      email,
      username,
      password,
      refreshToken,
    );

    // retrun response
    if (resService.status) {
      return res
        .status(200)
        .json({ status: resService.status, message: resService.message });
    } else {
    }
  } catch (error) {
    next(error);
    // return res
    //   .status(500)
    //   .json({ status: false, message: "server error", error: error });
  }
}
