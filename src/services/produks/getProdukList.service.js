import getProdukListModel from "../../models/repo/produks/getProdukList.repo.js";

export default async function getProdukListService() {
  const resModel = await getProdukListModel();

  if (resModel.status) {
    return { status: resModel.status, produk_list: resModel.produk_list };
  }
}
