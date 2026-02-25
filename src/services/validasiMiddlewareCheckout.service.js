import jwt from "jsonwebtoken";

export default async function validasiMiddlewareCheckoutSevice(
  refreshToken,
  accessToken,
) {
  // validasi inputan not values
  if (!refreshToken || !accessToken) {
    return { status: false, message: "error, headers or cookie is not values" };
  }

  const verifikasiJwt = await jwt.verify(
    accessToken,
    process.env.SECRET_KEY_JWT,
    { algorithms: ["HS256"] },
  );

  // ubah waktu sekarang ke milidetik
  const currentStamp = Math.floor(Date.now() / 1000);

  if (currentStamp > verifikasiJwt.exp) {
    return { status: true };
  } else {
    return { status: false, user_id: verifikasiJwt.user_id };
  }
}
