import db from "../../../config/db.config.js";

export default async function editProduksModel(fields, values) {
  const [resQuery] = await db.query(
    `update produks set ${fields.join(", ")} where produk_id = ?`,
    values,
  );

  if (resQuery.affectedRows) {
    return { status: true };
  } else {
    return { status: false };
  }
}
