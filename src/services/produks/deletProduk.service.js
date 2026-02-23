import deleteProdukModel from "../../models/repo/produks/deleteProduk.repo.js";

export default async function deleteProdukService(produk_id_params) {
  if (!produk_id_params) {
    return { status: false, message: "invalid produks id is not empety" };
  }

  // searching produk_id in db
  const [deleteProduk] = await Promise.all([
    deleteProdukModel(produk_id_params),
  ]);

  if (deleteProduk.status) {
    return { status: true, message: "success delete produks" };
  } else {
    return {
      status: false,
      message: "invalid delete produks, produks_id is not found",
    };
  }
}
