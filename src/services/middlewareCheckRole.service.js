import middlewareCheckRoleRepo from "../models/repo/middlewareCheckRole.repo.js";

export default async function middlewareCheckRole(refreshToken) {
  // check kedalam db
  const checkRoleUser = await middlewareCheckRoleRepo(refreshToken);

  console.log(checkRoleUser);

  if (checkRoleUser.status) {
    return {
      status: true,
      message: "success get role",
      role: checkRoleUser.role,
    };
  } else {
    return { status: checkRoleUser.status, message: "invalid get role users" };
  }
}
