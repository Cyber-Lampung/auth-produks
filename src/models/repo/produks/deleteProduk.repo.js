import db from "../../../config/db.config.js";

export default async function deleteProdukModel(produk_id_params) {
  const [resQuery] = await db.query(
    "delete produks from produks where produk_id = ?",
    produk_id_params,
  );

  if (resQuery.affectedRows > 0) {
    return { status: true };
  } else {
    return { status: false };
  }
}
