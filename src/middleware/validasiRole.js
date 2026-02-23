export default async function validasiRoleUser(req, res, next) {
  if (req.role !== "admin") {
    return res
      .status(403)
      .json({ status: false, message: "invalid authorization" });
  }

  next();
}
