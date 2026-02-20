import middlewareCheckRole from "../services/middlewareCheckRole.service.js";

export default async function useCheckCookieUser(req, res, next) {
  // const refreshToken = Object.values(req.cookies.refreshToken).map((token) => {
  //   return token;
  // });

  const refreshToken = req.cookies.refreshToken;

  if (!refreshToken) {
    return { status: false, message: "invalid refreshToken not found" };
  }

  // checking role in db
  const resServiceCheckRole = await middlewareCheckRole(refreshToken);

  req.token = refreshToken;
  req.role = resServiceCheckRole.role;
  next();
}
