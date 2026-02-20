import useUserLoginModel from "../../models/repo/auth/useUserLoginModel.repo.js";
import passwordHashing from "../../utils/passwordHashing.js";
import createdAuthorization from "../../utils/createdAuthorization.js";

export default async function useServiceUserLogin(email, password) {
  const { getUserLogin, getRefreshToken } = await useUserLoginModel();
  const { comparePassword } = await passwordHashing();
  const { accessToken } = await createdAuthorization();

  if (password.length < 8) {
    return {
      status: false,
      message: "invalid login, fields password min 8 character",
    };
  }

  // get refreshToken dari user_id
  const resModel = await getUserLogin(email);
  const refreshToken = await getRefreshToken(resModel.user_id);
  const resAccessToken = await accessToken(resModel.user_id, resModel.role);

  const passwordCheck = await comparePassword(password, resModel.password);

  if (!resModel.status) {
    return { status: false, message: "invalid login user, user not found" };
  }

  if (resModel.status && passwordCheck) {
    return {
      status: true,
      message: "success login, user found",
      sessions: { resAccessToken, resRefreshToken: refreshToken.refreshToken },
    };
  } else {
    return { status: false, message: "invalid login user, password salah" };
  }
}
