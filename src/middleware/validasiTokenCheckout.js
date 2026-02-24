import validasiMiddlewareCheckoutSevice from "../services/validasiMiddlewareCheckout.service.js";

export default async function validasiMiddlewareCheckout(req, res, next) {
  const refreshToken = req.cookies.refreshToken;
  const accessToken = req.headers.authhorization.split(" ")[1];

  // validasi semua disini
  const resService = await validasiMiddlewareCheckoutSevice();
}
