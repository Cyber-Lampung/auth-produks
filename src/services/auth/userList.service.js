import useGetUserList from "../../models/repo/auth/userList.repo.js";

export default async function userListService() {
  // create connection ke model repo

  const resModel = await useGetUserList();

  if (resModel.status) {
    return { status: resModel.status, list: resModel.list };
  }
}
