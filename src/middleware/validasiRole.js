export default async function validasiRoleUser(req, res, next) {
  console.log(req.role);

  if (req.role !== "admin") {
    return res
      .status(403)
      .json({ status: false, message: "invalid authorization" });
  }

  next();
}
