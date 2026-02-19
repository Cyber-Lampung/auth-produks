import useDeleteAccountService from "../../services/auth/useDeleteAccount.service.js";

export default async function useDeleteAccountController(req, res, next) {
  try {
    const refreshToken = req.token;
    const resService = await useDeleteAccountService(refreshToken);

    if (resService.status) {
      return res
        .status(200)
        .json({ status: true, message: resService.message });
    } else {
      return res
        .status(404)
        .json({ status: false, message: resService.message });
    }

    //
  } catch (error) {
    next(error);
    // return res
    //   .status(500)
    //   .json({ status: false, message: "server error", error: error });
  }
}
