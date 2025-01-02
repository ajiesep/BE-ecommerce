import asyncHandler from "../middlewares/asyncHandler.js";
import Product from "../models/productModel.js";

export const CreateProduct = asyncHandler(async (req, res) => {
  const newProduct = await Product.create(req.body);

  return res.status(201).json({
    message: "Product created",
    data: newProduct,
  });
});

export const AllProduct = asyncHandler(async (req, res) => {
  // Req Query
  const queryObj = { ...req.query };

  // fungsi untuk mengabaikan jika ada req page dan limit
  const excludeFields = ["page", "limit", "name"];
  excludeFields.forEach((element) => delete queryObj[element]);

  let query = Product.find(queryObj);

  if (req.query.name) {
    query = Product.find({ name: { $regex: req.query.name, $options: "i" } });
  } else {
    query = Product.find(queryObj);
  }

  // Pagination
  const page = req.query.page * 1 || 1;
  const limitData = req.query.limit * 1 || 30;
  const skipData = (page - 1) * limitData;

  query = query.skip(skipData).limit(limitData);

  let countProduct = await Product.countDocuments();

  if (req.query.page) {
    if (skipData >= countProduct) {
      res.status(404);
      throw new Error("This page does not exist");
    }
  }

  const data = await query;

  return res.status(200).json({
    message: "Berhasil tampil semua product",
    data,
    count: countProduct,
  });
});

export const detailProduct = asyncHandler(async (req, res) => {
  const paramsId = req.params.id;
  const productData = await Product.findById(paramsId);

  if (!productData) {
    res.status(404);
    throw new Error("Id tidak ditemukan");
  }

  return res.status(200).json({
    message: "Detail data product berhasil ditampilkan",
    data: productData,
  });
});

export const updateProduct = asyncHandler(async (req, res) => {
  const paramsId = req.params.id;
  const updateProduct = await Product.findByIdAndUpdate(paramsId, req.body, {
    runValidators: false,
    new: true,
  });
  return res.status(201).json({
    message: "Update product berhasil",
    data: updateProduct,
  });
});

export const deleteProduct = asyncHandler(async (req, res) => {
  const paramsId = req.params.id;
  await Product.findByIdAndDelete(paramsId);

  return res.status(200).json({
    message: "Product berhasil dihapus",
  });
});

export const FileUpload = asyncHandler(async (req, res) => {
  const file = req.file;
  if (!file) {
    res.status(400);
    throw new Error("Please upload a file");
  }

  const imageFileName = file.filename;
  const pathImageFile = `/uploads/${imageFileName}`;

  res.status(200).json({
    message: "File berhasil diupload",
    image: pathImageFile,
  });
});
