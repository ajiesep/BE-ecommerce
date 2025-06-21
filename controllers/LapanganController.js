import asyncHandler from "../middlewares/asyncHandler.js";
import Lapangan from "../models/lapanganModel.js";
import { v2 as cloudinary } from "cloudinary";
import streamifier from "streamifier";

export const CreateLapangan = asyncHandler(async (req, res) => {
  const newLapangan = await Lapangan.create(req.body);

  return res.status(201).json({
    message: "Lapangan created",
    data: newLapangan,
  });
});

export const AllLapangan = asyncHandler(async (req, res) => {
  // Req Query
  const queryObj = { ...req.query };

  // fungsi untuk mengabaikan jika ada req page dan limit
  const excludeFields = ["page", "limit", "name"];
  excludeFields.forEach((element) => delete queryObj[element]);

  let query = Lapangan.find(queryObj);

  if (req.query.name) {
    query = Lapangan.find({ name: { $regex: req.query.name, $options: "i" } });
  } else {
    query = Lapangan.find(queryObj);
  }

  // Pagination
  const page = req.query.page * 1 || 1;
  const limitData = req.query.limit * 1 || 10;
  const skipData = (page - 1) * limitData;

  query = query.skip(skipData).limit(limitData);

  let countLapangan = await Lapangan.countDocuments(queryObj);

  if (req.query.page) {
    if (skipData >= countLapangan) {
      res.status(404);
      throw new Error("This page does not exist");
    }
  }

  const data = await query;
  const totalPage = Math.ceil(countLapangan / limitData);

  return res.status(200).json({
    message: "Berhasil tampil semua lapangan",
    data,
    pagination: { totalPage, page, totalLapangan: countLapangan },
  });
});

export const detailLapangan = asyncHandler(async (req, res) => {
  const paramsId = req.params.id;
  const lapanganData = await Lapangan.findById(paramsId);

  if (!lapanganData) {
    res.status(404);
    throw new Error("Id tidak ditemukan");
  }

  return res.status(200).json({
    message: "Detail data lapangan berhasil ditampilkan",
    data: lapanganData,
  });
});

export const updateLapangan = asyncHandler(async (req, res) => {
  const paramsId = req.params.id;
  const updateLapangan = await Lapangan.findByIdAndUpdate(paramsId, req.body, {
    runValidators: false,
    new: true,
  });
  return res.status(201).json({
    message: "Update lapangan berhasil",
    data: updateLapangan,
  });
});

export const deleteLapangan = asyncHandler(async (req, res) => {
  const paramsId = req.params.id;
  await Lapangan.findByIdAndDelete(paramsId);

  return res.status(200).json({
    message: "Lapangan berhasil dihapus",
  });
});

export const FileUpload = asyncHandler(async (req, res) => {
  const stream = cloudinary.uploader.upload_stream(
    {
      folder: "uploads",
      allowed_formats: ["jpg", "png", "jpeg"],
    },
    function (err, result) {
      if (err) {
        console.log(err);
        return res.status(500).json({
          message: "Upload file gagal",
          error: err,
        });
      }
      res.json({ message: "Upload file berhasil", url: result.secure_url });
    }
  );
  streamifier.createReadStream(req.file.buffer).pipe(stream);
});
