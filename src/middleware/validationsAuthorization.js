import jwt from "jsonwebtoken";

export default async function validasiAuthrozations() {
  const accessToken = req.headers.authorization.split(" ")[1];

  // verifikasi jwt

  const verifikasiJwt = jwt.verify(accessToken);

  console.log(verifikasiJwt);
}
