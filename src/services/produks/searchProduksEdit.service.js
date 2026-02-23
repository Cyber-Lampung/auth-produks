import searchProduksModel from "../../models/repo/produks/searchProduks.repo.js";

export default async function searchProduksEditService(produks_id) {
  if (!produks_id) {
    return {
      status: false,
      message: "inavlid search produks edit, invalid produks_id",
    };
  }

  const resModel = await searchProduksModel(produks_id);

  if (resModel.status) {
    return {
      status: true,
      message: "success get data produks",
      data: resModel.data,
    };
  } else {
    return { status: false, message: "invalid get produks, produks not found" };
  }
}
