import connectDb from "../../../config/db.config.js";

export default async function useGetUserList() {
  const db = await connectDb();

  const [resQuery] = await db.query("select * from users");

  if (resQuery) {
    return { status: true, list: resQuery };
  } else {
    return { status: false };
  }
}
