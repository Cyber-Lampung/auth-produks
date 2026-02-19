import connectDb from "../../../config/db.config.js";

export default async function useEditPorfileModel() {
  const db = await connectDb();

  const useChangeEditProfile = async (fields, values) => {
    // console.log(fields.join(", "), values);

    const [resQuery] = await db.query(
      `update users set ${fields.join(", ")} where user_id = ? `,
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
