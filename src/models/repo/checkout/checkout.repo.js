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

export async function searchProduksModel(arr_produk_id) {
  if (!arr_produk_id || arr_produk_id.length === 0) {
    return [];
  }

  const placeholders = arr_produk_id.map(() => "?").join(", ");

  //   const query = `
  //   SELECT * FROM produks
  //   WHERE produk_id IN (${fields})
  // `;

  const [row] = await db.execute(
    `select produks.produk_name, produks.stock, produks.price from produks where produk_id in (${placeholders}) and produks.stock > 2 for update`,
    arr_produk_id,
  );

  return row;
}

export async function updateStockProdukModel(checkout_information) {
  let caseQuery = "";
  let ids = [];
  let values = [];

  for (const item of checkout_information) {
    caseQuery += `when produk_id = ? then stock - ?`;
    values.push(item.produks_id, item.qyt);
    ids.push(item.produks_id);
  }

  const placeholders = ids.map(() => "?").join(", ");

  const query = `update produks set stock = CASE ${caseQuery} end where produk_id in (${placeholders})`;

  const [rows] = await db.execute(query, [...values, ...ids]);

  if (rows.affectedRows > 0) {
    return true;
  } else {
    return false;
  }
}

export async function saveRiwayatCheckout(
  checkout_id,
  user_id,
  checkout_information,
  total,
) {
  const query = `insert into riwayat_store (user_id, riwayat_id, produk_store, price_total, time_store) values (?, ?, ?, ?, NOW())`;

  // save riwayat store
  const [resQuery] = await db.execute(query, [
    user_id,
    checkout_id,
    JSON.stringify(checkout_information),
    total,
  ]);

  if (resQuery.affectedRows > 0) {
    return true;
  } else {
    return false;
  }
}

export async function saveInvoiceModel(invoice_id, user_id, status_invoice) {
  const query = `insert into invoice (invoice_id, user_id, status_invoice, created, expires) values (?, ?, ?, NOW(), DATE_ADD(NOW(), INTERVAL 15 MINUTE))`;

  const [resQuery] = await db.execute(query, [
    invoice_id,
    user_id,
    status_invoice,
  ]);

  if (resQuery.affectedRows > 0) {
    return true;
  } else {
    return false;
  }
}

export async function searchInvoiceModel(user_id) {
  const query = `select status_invoice from invoice where user_id = ?`;

  const [resQuery] = await db.execute(query, [user_id]);

  return resQuery;
}
