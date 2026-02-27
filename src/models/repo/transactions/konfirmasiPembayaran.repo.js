import db from "../../../config/db.config.js";

export async function getStatusPembayaranModel(user_id) {
  const query = `select invoice.status_invoice, riwayat_store.price_total from invoice inner join riwayat_store on invoice.user_id = riwayat_store.user_id where invoice.user_id = ?`;

  const [resQuery] = await db.execute(query, [user_id]);

  return resQuery[0];
}

export async function updateStatusInvoiceModel(status_invoice, user_id) {
  const query = `update invoice set status_invoice = ? where user_id = ?`;

  const [resQuery] = await db.execute(query, [status_invoice, user_id]);

  if (resQuery.affectedRows > 0) {
    return true;
  } else {
    return false;
  }
}
