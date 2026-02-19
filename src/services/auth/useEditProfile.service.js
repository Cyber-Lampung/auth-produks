import useEditPorfileModel from "../../models/repo/auth/useEditProfile.repo.js";

export default async function useEditPorfileService(
  email,
  username,
  password,
  refreshToken,
) {
  const { useChangeEditProfile, useGetUserIdFromRefreshTokenModel } =
    await useEditPorfileModel();

  const valueRefreshToken = Object.values(refreshToken).map((token) => {
    return token;
  });

  // fields and values for save sementara
  const fields = [];
  const values = [];

  // validasi inputan
  if (email) {
    fields.push("email = ?");
    values.push(email);
  }

  if (username) {
    fields.push("username = ?");
    values.push(username);
  }

  if (password) {
    fields.push("password = ?");
    values.push(password);
  }

  // get user_id from refreshToken

  const getUser_id = await useGetUserIdFromRefreshTokenModel(
    valueRefreshToken[0],
  );

  values.push(getUser_id.data.user_id);

  // update user identity

  const updateUser = await useChangeEditProfile(fields, values);

  if (updateUser.status) {
    return { status: true, message: "update users success" };
  } else {
    return { status: false, message: "invalid update users" };
  }
}
