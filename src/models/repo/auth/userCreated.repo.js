import connectDb from "../../../config/db.config.js";

export default async function useSaveCreatedUserModel() {
  const db = await connectDb();

  const useSaveCreatedUser = async (
    user_id,
    email,
    username,
    passwordHashForDb,
    role,
  ) => {
    const [resQuery] = await db.query(
      "insert into users (user_id, email, username, password, role, created) values (?, ?, ?, ?, ?, NOW())",
      [user_id, email, username, passwordHashForDb, role],
    );

    if (resQuery.affectedRows > 0) {
      return { status: true };
    } else {
      return { status: false };
    }
  };

  const useSaveCreatedRefreshToken = async (
    session_id,
    user_id,
    refreshToken,
  ) => {
    const [resQuery] = await db.query(
      "insert into sessions (session_id, user_id, refreshToken, created, expiress, isActive) values (?, ?, ?, NOW(), DATE_ADD(NOW(), INTERVAL 7 DAY), 1)",
      [session_id, user_id, refreshToken],
    );

    if (resQuery.affectedRows > 0) {
      return { status: true };
    } else {
      return { status: false };
    }
  };

  return { useSaveCreatedUser, useSaveCreatedRefreshToken };
}
