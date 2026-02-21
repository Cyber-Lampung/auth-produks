import db from "../../../config/db.config.js";

export default async function getProdukListModel() {
  const [resQuery] = await db.query("select * from produks");

  return { status: true, produk_list: resQuery };
}
