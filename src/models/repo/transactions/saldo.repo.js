import db from "../../../config/db.config.js";

export async function upadateSaldoModel(user_id) {
  // corrected to a SELECT; original UPDATE was invalid SQL
  const [resQuery] = await db.query(
    "select total_saldo from saldo where user_id = ?",
    [user_id],
  );

  return resQuery[0];
}
