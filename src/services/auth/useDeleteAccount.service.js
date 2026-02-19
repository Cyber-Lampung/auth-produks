import useDeleteAccountModel from "../../models/repo/auth/useDeleteAccount.repo.js";

export default async function useDeleteAccountService(refreshToken) {
  const { findRefreshToken, useDeleteUser } = await useDeleteAccountModel();

  const getUserId = await findRefreshToken(refreshToken);

  console.log(getUserId);

  if (!getUserId) {
    return {
      status: false,
      message: "refreshToken tidak ditemukan, user not valid",
    };
  }

  const user_id = Object.values(getUserId).map((token) => {
    return token;
  });

  const getAccountResponseDelete = await useDeleteUser(user_id);

  console.log(getAccountResponseDelete);

  if (getAccountResponseDelete.status) {
    return { status: true, message: "success delete account users" };
  } else {
    return {
      status: false,
      message: "invalid delete account users, user not found",
    };
  }
}
