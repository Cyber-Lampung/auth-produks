export default async function useCheckCookieUser(req, res, next) {
  const refreshToken = Object.values(req.cookies.refreshToken).map((token) => {
    return token;
  });

  if (!refreshToken) {
    return { status: false, message: "invalid refreshToken not found" };
  }

  // if (refreshToken.length < 36) {
  //   return res
  //     .status(403)
  //     .json({ status: false, message: "values not modified" });
  // }

  req.token = refreshToken[0];
  next();
}
