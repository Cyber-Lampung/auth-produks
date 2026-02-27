import {
  getStatusPembayaranModel,
  updateStatusInvoiceModel,
} from "../../models/repo/transactions/konfirmasiPembayaran.repo.js";

export default async function konfirmasiPembayaranService(
  user_id,
  type_payment,
  total_pembayaran,
) {
  const [getInvoiceUser] = await Promise.all([
    getStatusPembayaranModel(user_id),
  ]);

  // search user_id apakah ada dan status nya masih pending
  const validasiStatus = getInvoiceUser.status_invoice === "pending";

  if (validasiStatus) {
    // validasi apakah pembayaran dengan total_pembayaran sama atau kurang

    console.log(getInvoiceUser.price_total);
    const validasiTotal = total_pembayaran === getInvoiceUser.price_total;

    if (!validasiTotal) {
      return { status: false, message: "invalid total pembayaran tidak cocok" };
    }

    const status_invoice = "done";

    // ubah status invoice
    const updateStatusInvoice = updateStatusInvoiceModel(
      status_invoice,
      user_id,
    );

    if (updateStatusInvoice) {
      return {
        status: true,
        message: "success update status pembeyaran, Terima Kasih",
      };
    } else {
      return { status: false, message: "invalid update status pembayaran" };
    }
  } else {
    return {
      status: true,
      message: "status pembayaran sudah done, Terima Kasih",
    };
  }

  // ambil status pembayaran berdasarkan user_id
}
