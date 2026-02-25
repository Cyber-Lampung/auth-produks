import validasiMiddlewareCheckoutSevice from "../services/validasiMiddlewareCheckout.service.js";

export default async function validasiMiddlewareCheckout(req, res, next) {
  const refreshToken = req.cookies.refreshToken;
  const accessToken = req.headers.authorization.split(" ")[1];

  // validasi semua disini
  const resService = await validasiMiddlewareCheckoutSevice(
    refreshToken,
    accessToken,
  );

  if (resService.status) {
    const error = new Error();
    error.message = "invalid, accessToken expiress";
    error.status = 401;

    return next(error);
  }

  req.user_id = resService.user_id;
  next();
}
