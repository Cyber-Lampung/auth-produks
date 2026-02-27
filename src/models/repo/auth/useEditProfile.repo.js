import db from "../../../config/db.config.js";

export default async function useEditPorfileModel() {
  const useChangeEditProfile = async (fields, values) => {
    // whitelist columns to prevent SQL injection via column names
    const allowedColumns = ["email", "username", "password"];

    const sanitizedFields = [];

    for (const f of fields) {
      const match = String(f)
        .trim()
        .match(/^([a-zA-Z_]+)\s*=\s*\?$/);
      if (!match) {
        return { status: false, error: "invalid field format" };
      }
      const col = match[1];
      if (!allowedColumns.includes(col)) {
        return { status: false, error: `invalid column: ${col}` };
      }
      sanitizedFields.push(`${col} = ?`);
    }

    const [resQuery] = await db.query(
      `update users set ${sanitizedFields.join(", ")} where user_id = ? `,
      values,
    );

    if (resQuery.affectedRows > 0) {
      return { status: true };
    } else {
      return { status: false };
    }
  };

  const useGetUserIdFromRefreshTokenModel = async (refreshToken) => {
    const [resQuery] = await db.query(
      "select user_id from sessions where refreshToken = ? ",
      [refreshToken],
    );

    if (resQuery) {
      return { status: true, data: resQuery[0] };
    } else {
      return { status: false };
    }
  };

  return { useChangeEditProfile, useGetUserIdFromRefreshTokenModel };
}
