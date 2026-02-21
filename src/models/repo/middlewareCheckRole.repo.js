import db from "../../config/db.config.js";

export default async function middlewareCheckRoleRepo(refreshToken) {
  //
  // const [resQuery] = await db.query(
  //   "select user_id from sessions where refreshToken = ?",
  //   [refreshToken],
  // );

  // //
  // const [searchRole] = await db.query(
  //   "select role from users where user_id = ?",
  //   [resQuery[0].user_id],
  // );

  const [resQuery] = await db.query(
    "select users.role from users inner join sessions on users.user_id = sessions.user_id where sessions.refreshToken = ?  ",
    [refreshToken],
  );

  //
  if (resQuery) {
    return { status: true, role: resQuery[0].role };
  } else {
    return { status: false };
  }
}
