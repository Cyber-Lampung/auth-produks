import jwt from "jsonwebtoken";

export default async function validasiAuthrozationToken(req, res, next) {
  try {
    // get accessToken headers.authorization.split(" ")[1];
    const accessToken = req.cookies.accessToken;

    if (!accessToken) {
      return res
        .status(401)
        .json({ status: false, message: "invalid accessToken expiress" });
    }

    // verifikasi
    const verifikasiJwt = await jwt.verify(
      accessToken,
      process.env.SECRET_KEY_JWT,
      { algorithms: "HS256", complete: true },
    );

    // kembalikan keperluan
    req.user_id = verifikasiJwt.user_id;
    req.role = verifikasiJwt.role;

    const currentStamp = Math.floor(Date.now() / 1000); // ubah kedetik

    if (currentStamp > verifikasiJwt.payload.exp) {
      return res.status(401).json({ status: false });
    } else {
      // return res.status(200).json({ status: true });
      next();
    }
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      return res
        .status(401)
        .json({ status: false, message: "invalid accessToken expiress" });
    }
    next(error);
  }
}
