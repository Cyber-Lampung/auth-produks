import passwordHashing from "../../utils/passwordHashing.js";
import generateUUID from "../../utils/generateUUID.js";
// import createdAdminModel from "../../models/repo/auth/adminCreated.repo.js";
import createdAuthorization from "../../utils/createdAuthorization.js";
import {
  saveAdmin,
  saveToken,
} from "../../models/repo/auth/adminCreated.repo.js";

export default async function createdAdminAcountService(
  email,
  username,
  password,
) {
  const { passwordHash } = await passwordHashing();
  // const { saveAdmin, saveToken } = createdAdminModel();
  const { accessToken } = await createdAuthorization();

  if (password.length < 8) {
    return res
      .status(400)
      .json({ status: false, message: "Password too weak" });
  }

  const user_id = await generateUUID();
  const hashPassword = await passwordHash(password);
  const session_id = await generateUUID();
  const refreshToken = await generateUUID();
  const role = "admin";

  // created sessions admin

  const resAccessToken = await accessToken(user_id, role);

  // const resSaveAdmin = await saveAdmin(user_id, email, username, hashPassword, role)
  // const resSaveToken = await saveToken(session_id, user_id, refreshToken);

  // optimasi query

  const [resSaveAdmin, resSaveToken] = await Promise.all([
    saveAdmin(user_id, email, username, hashPassword, role),
    saveToken(session_id, user_id, refreshToken),
  ]);

  if (resSaveAdmin.status && resSaveToken.status) {
    return {
      status: true,
      message: "success created admin account",
      token: { resAccessToken, refreshToken },
    };
  } else {
    return { status: false, message: "invalid created admin account" };
  }
}
