import tokenVerifService from "../../services/auth/tokenVerif.service.js";

export default async function activeteCodeController(req, res, next) {
  try {
    const { token } = req.body;
    const refreshToken = req.token;

    const resService = await tokenVerifService(token, refreshToken);

    if (resService.status) {
      return res.status(200).json({
        status: true,
        message: resService.message,
      });
    } else {
      return res
        .status(401)
        .json({ status: false, message: resService.message });
    }
  } catch (error) {
    next(error);
  }
}
