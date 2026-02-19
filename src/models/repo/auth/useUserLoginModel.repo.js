import connectDb from "../../../config/db.config.js";

export default async function useUserLoginModel() {
  const db = await connectDb();

  const getUserLogin = async (email) => {
    const [resQuery] = await db.query("select * from users where email = ?", [
      email,
    ]);

    if (resQuery) {
      // update isActive menjadi = 1

      await db.query("update sessions set isActive = 1 where user_id = ?", [
        resQuery[0].user_id,
      ]);

      return {
        status: true,
        password: resQuery[0].password,
        user_id: resQuery[0].user_id,
        role: resQuery[0].role,
      };
    } else {
      return { status: false };
    }
  };

  const getRefreshToken = async (user_id) => {
    const [resQuery] = await db.query(
      "select refreshToken from sessions where user_id = ?",
      [user_id],
    );

    return resQuery[0];
  };

  return { getUserLogin, getRefreshToken };
}
