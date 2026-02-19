export default async function checkToken(req, res, next) {
  const tokenHeader = await req.headers.authorization.split(" ")[1];

  if (!tokenHeader) {
    const err = new Error();
    err.stack;
    next(err);
    return res
      .status(401)
      .json({ status: false, message: "invalid bearer token not found" });
  }

  next();
}
