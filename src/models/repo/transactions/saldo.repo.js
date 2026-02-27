import db from "../../../config/db.config.js";

export async function upadateSaldoModel(user_id) {
  const [resQuery] = await db.query(
    "update total_saldo from saldo where user_id = ?",
    [user_id],
  );

  console.log(resQuery[0]);
}
