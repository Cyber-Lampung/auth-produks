import db from "../../../config/db.config.js";

export default async function verifTokenModel() {
  //   token
  const searchTokenModel = async (refreshToken) => {
    const [resQuery] = await db.query(
      "select token from activate_code where refreshToken = ?",
      [refreshToken],
    );
  };

  return { searchTokenModel };
}
