import useChangeIsActiveUser from "../../models/repo/auth/useChangeIsActiveUser.repo.js";

export default async function useServiceLogoutUser(refreshToken) {
  // search user_id by refreshToken

  const changeIsActive = await useChangeIsActiveUser(refreshToken);

  if (changeIsActive.status) {
    return { status: true, message: "succes logout users" };
  }
}
