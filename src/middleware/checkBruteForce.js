export default async function middlewareCheckBruteForce(req, res, next) {
  const storageCheck = [];

  const ip = req.ip || req.headers["x-forwarded-for"];

  if (!ip) {
    return res
      .status(401)
      .json({ status: false, message: "detection private network" });
  }

  const check = storageCheck.filter(ip);

  console.log(check);
}
