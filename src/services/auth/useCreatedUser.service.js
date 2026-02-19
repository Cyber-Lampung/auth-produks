import createdAuthorization from "../../utils/createdAuthorization.js";
import generateUUID from "../../utils/generateUUID.js";
import passwordHashing from "../../utils/passwordHashing.js";
import useSaveCreatedUserModel from "../../models/repo/auth/userCreated.repo.js";

export default async function useSeviceCreatedUser(email, username, password) {
  const { passwordHash } = await passwordHashing(password);
  const { useSaveCreatedUser, useSaveCreatedRefreshToken } =
    await useSaveCreatedUserModel();

  // // validasi inputan
  // if (!email || !username || !password) {
  //   return { status: false, message: "invalid fields not empety" };
  // }

  if (password.length < 8) {
    return { status: false, message: "password not strong, min 8 character" };
  }

  // requirement user
  const user_id = await generateUUID();
  const session_id = await generateUUID();
  const role = "user";
  const passwordHashForDb = await passwordHash(password);

  // created accessToken dan refreshToken

  const { accessToken, refreshToken } = await createdAuthorization();

  const resAccessToken = await accessToken(user_id, role);
  const resRefreshToken = await refreshToken();

  const resModel = await useSaveCreatedUser(
    user_id,
    email,
    username,
    passwordHashForDb,
    role,
  );

  const resSaveRefreshTokenModel = await useSaveCreatedRefreshToken(
    session_id,
    user_id,
    resRefreshToken,
  );

  if (resModel.status && resSaveRefreshTokenModel.status) {
    return {
      status: true,
      message: "success created users",
      dataSession: { resAccessToken, resRefreshToken },
    };
  } else {
    return { status: false, message: "invalid created users" };
  }
}
