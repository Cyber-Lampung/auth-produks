import db from "../../../config/db.config.js";

export default async function editProduksModel(fields, values) {
  // whitelist columns to prevent SQL injection via column names
  const allowedColumns = [
    "produk_name",
    "price",
    "stock",
    "more_information",
    "upload_created",
  ];

  // fields expected in format: "column = ?"
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
    `update produks set ${sanitizedFields.join(", ")} where produk_id = ?`,
    values,
  );

  if (resQuery.affectedRows) {
    return { status: true };
  } else {
    return { status: false };
  }
}
