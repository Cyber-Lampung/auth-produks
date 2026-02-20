import connectDb from "../../config/db.config.js";

export default async function middlewareCheckRoleRepo(refreshToken) {
  const db = await connectDb();

  const [resQuery] = await db.query(
    "select user_id from sessions where refreshToken = ?",
    [refreshToken],
  );

  const [searchRole] = await db.query(
    "select role from users where user_id = ?",
    [resQuery[0].user_id],
  );

  if (searchRole) {
    return { status: true, role: searchRole[0].role };
  } else {
    return { status: false };
  }
}
