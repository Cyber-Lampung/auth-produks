import middlewareCheckRole from "../services/middlewareCheckRole.service.js";

export default async function useCheckCookieUser(req, res, next) {
  try {
    const refreshToken = req.cookies.refreshToken;

    if (!refreshToken) {
      return res
        .status(401)
        .json({ status: false, message: "invalid refreshToken not found" });
    }

    // checking role in db
    const resServiceCheckRole = await middlewareCheckRole(refreshToken);

    if (!resServiceCheckRole || !resServiceCheckRole.role) {
      return res
        .status(401)
        .json({ status: false, message: "invalid or expired session" });
    }

    req.token = refreshToken;
    req.role = resServiceCheckRole.role;
    return next();
  } catch (error) {
    return next(error);
  }
}
