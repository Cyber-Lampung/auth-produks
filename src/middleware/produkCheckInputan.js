import validationInputanProdukService from "../services/produks/validationsInputan.service.js";

export default async function checkInputanProduk(req, res, next) {
  // check inputan user validation
  const { produk_name, price, stock, size, desc, category_produks } = req.body;
  const images = req.file.filename;
  const hostname = req.hostname;
  const protocol = req.protocol;
  const port = req.socket.localPort;

  const urlPath = protocol + "://" + hostname + ":" + port + "/uploads/";

  const resServiceValdation = await validationInputanProdukService(
    produk_name,
    price,
    stock,
    size,
    desc,
    category_produks,
  );

  if (!resServiceValdation) {
    return res.status(400).json({
      status: false,
      message: "invalid upload, fields produk is empety",
    });
  }

  req.produk = {
    produk_name,
    price,
    stock,
    size,
    desc,
    category_produks,
    images,
    urlPath,
  };
  next();
}
