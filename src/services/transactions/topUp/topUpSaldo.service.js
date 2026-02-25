export default async function topUpSaldoService(user_id, saldo) {
  if (!saldo || saldo.includes("-") || saldo < 0) {
    return { status: false, message: "error topup saldo" };
  }

  return { status: true, message: "success transaction, check your saldo" };
}
