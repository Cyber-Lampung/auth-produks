import verifTokenModel from "../../models/repo/auth/searchToken.repo.js";

export default async function tokenVerifService(token, refreshToken) {
  const { searchTokenModel } = await verifTokenModel();

  // check token apakah kosong atau tidak
  if (!token) {
    return { status: false, message: "invalid token not empety" };
  }

  // check token apakah kurang dari 6
  if (token.length < 6) {
    return { status: false, message: "invalid token, token min 6 charachter" };
  }

  // verif token berdasarkan
  const searchTokenByRefreshToken = await searchTokenModel(refreshToken);

  // search token dalam db apakaah ada atau tidak jika ada maka lanjut jika tidak return ini
  if (!searchTokenByRefreshToken) {
    return { status: false, message: "invalid token user not found" };
  }

  // jika ada maka validasi dengan ini
  const validasiToken = token === searchTokenByRefreshToken.token;

  // jika validasi tidak sama maka tidak dilanjutkan dan return ini
  if (!validasiToken) {
    return { status: false, message: "invalid token, token not valid" };
  }
}
