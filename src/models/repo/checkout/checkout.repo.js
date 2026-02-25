import db from "../../../config/db.config.js";

export async function userInformationModel(user_id) {
  const [resQuery] = await db.query(
    "select email, username from users where user_id = ? ",
    [user_id],
  );

  if (resQuery[0]) {
    return { status: true, data: resQuery[0] };
  }
}

export async function searchProduksModel(produks_id) {
  const [resQuery] = await db.query(
    "select * from produks where produk_id = ?",
    [produks_id],
  );

  return { status: true, data: resQuery[0] };
}
