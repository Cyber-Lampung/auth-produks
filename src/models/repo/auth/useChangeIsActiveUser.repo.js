import db from "../../../config/db.config.js";

export default async function useChangeIsActiveUser(refreshToken) {
  await db.query("update sessions set isActive = 0 where refreshToken = ?", [
    refreshToken,
  ]);

  return { status: true };
}
