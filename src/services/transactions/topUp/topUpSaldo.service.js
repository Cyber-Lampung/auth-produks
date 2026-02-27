import generateUUID from "../../../utils/generateUUID.js";
import { upadateSaldoModel } from "../../../models/repo/transactions/saldo.repo.js";

export default async function topUpSaldoService(user_id, saldo) {
  const regexSaldo = /-/;

  if (!saldo || regexSaldo.test(saldo) || saldo <= 1000) {
    return { status: false, message: "error topup saldo" };
  }

  const id_transaction = await generateUUID();

  // simpan saldo dan save riwayat
  //   const updateSaldoUser = await updateSaldoUserModel(
  //     user_id,
  //     saldo,
  //     id_transaction,
  //   );

  const [updateSaldo, updateRiwayatSaldo] = await Promise.all(
    upadateSaldoModel(user_id),
    // saveRiwayatTopUpModel(),
  );

  return { status: true, message: "success transaction, check your saldo" };
}
