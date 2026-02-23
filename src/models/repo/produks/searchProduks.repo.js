import db from "../../../config/db.config.js";

export default async function searchProduksModel(produks_id) {
  const [resQuery] = await db.query(
    "select * from produks where produk_id = ?",
    [produks_id],
  );

  if (resQuery) {
    return { status: true, data: resQuery[0] };
  } else {
    return { status: false };
  }
}
