import connectDb from "../../../config/db.config.js";

export default async function useDeleteAccountModel() {
  const db = await connectDb();

  const findRefreshToken = async (refreshToken) => {
    const [resQuery] = await db.query(
      "select user_id from sessions where refreshToken = ?",
      [refreshToken],
    );

    return resQuery[0];
  };

  const useDeleteUser = async (user_id) => {
    const [resQuery] = await db.query("delete from users where user_id = ? ", [
      user_id,
    ]);

    if (resQuery.affectedRows > 0) {
      return { status: true };
    } else {
      return { status: false };
    }
  };

  return { findRefreshToken, useDeleteUser };
}
