export default async function validationInputanProdukService(
  produk_name,
  price,
  stock,
  desc,
  image,
) {
  // validations

  if (!produk_name || !price || !stock || !desc || !image) {
    return {
      status: false,
    };
  } else {
    return { status: true };
  }
}
