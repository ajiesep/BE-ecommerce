import asyncHandler from "../middlewares/asyncHandler.js";
import Lapangan from "../models/lapanganModel.js";
import Book from "../models/bookModel.js";
import midtransClient from "midtrans-client";
import dotenv from "dotenv";
dotenv.config();

let snap = new midtransClient.Snap({
  // Set to true if you want Production Environment (accept real transaction).
  isProduction: false,
  serverKey: process.env.MIDTRANS_SERVER,
});

export const CreateBook = asyncHandler(async (req, res) => {
  const { email, firstName, lastName, phone, cartItem } = req.body;
  if (!cartItem || cartItem.length < 1) {
    res.status(400);
    throw new Error("Keranjang masih kosong");
  }

  let bookItem = [];
  let bookMidtrans = [];
  let total = 0;

  for (const cart of cartItem) {
    const lapanganData = await Lapangan.findOne({ _id: cart.lapangan });
    if (!lapanganData) {
      res.status(400);
      throw new Error("id Lapangan tidak ditemukan");
    }

    const { name, price, _id, stock } = lapanganData;

    if (cart.quantity > stock) {
      res.status(400);
      throw new Error(
        `jumlah lapangan dari lapangan ${name} melebihi stock lapangan`
      );
    }

    const singleLapangan = {
      quantity: cart.quantity,
      name,
      price,
      lapangan: _id,
    };

    const shortName = name.substring(0, 30);
    const singleLapanganMidtrans = {
      quantity: cart.quantity,
      name: shortName,
      price,
      id: _id,
    };

    bookItem = [...bookItem, singleLapangan];
    bookMidtrans = [...bookMidtrans, singleLapanganMidtrans];

    total += cart.quantity * price;
  }

  const book = await Book.create({
    itemsDetail: bookItem,
    total,
    firstName,
    lastName,
    email,
    phone,
    user: req.user.id,
  });

  let parameter = {
    transaction_details: {
      order_id: book._id.toString(),
      gross_amount: total,
    },
    item_details: bookMidtrans,
    customer_details: {
      first_name: firstName,
      last_name: lastName,
      email: email,
      phone: phone,
    },
  };

  const token = await snap.createTransaction(parameter);

  return res.status(201).json({
    total,
    book,
    message: "berhasil buat Book Lapangan",
    token,
  });
});

export const AllBook = asyncHandler(async (req, res) => {
  const books = await Book.find();

  return res.status(200).json({
    data: books,
    message: "Berhasil tampil semua book lapangan",
  });
});

export const DetailBook = asyncHandler(async (req, res) => {
  const book = await Book.findById(req.params.id);

  return res.status(200).json({
    data: book,
    message: "Berhasil detail book lapangan",
  });
});

export const CurrentUserBook = asyncHandler(async (req, res) => {
  const book = await Book.find({ user: req.user.id });

  return res.status(200).json({
    data: book,
    message: "Berhasil tampil Current user book lapangan",
  });
});

export const callbackPayment = asyncHandler(async (req, res) => {
  const statusResponse = await snap.transaction.notification(req.body);

  const orderId = statusResponse.order_id;
  const transactionStatus = statusResponse.transaction_status;
  const fraudStatus = statusResponse.fraud_status;

  const bookData = await Book.findById(orderId);

  if (!bookData) {
    res.status(400);
    throw new Error("Book tidak ditemukan");
  }

  if (transactionStatus === "capture" || transactionStatus === "settlement") {
    if (fraudStatus === "accept") {
      const bookLapangan = bookData.itemsDetail;

      for (const itemLapangan of bookLapangan) {
        const lapanganData = await Lapangan.findById(itemLapangan.lapangan);

        if (!lapanganData) {
          res.status(400);
          throw new Error("Lapangan tidak ditemukan");
        }
        lapanganData.stock -= itemLapangan.quantity;
        await lapanganData.save();
      }

      bookData.status = "success";
    }
  } else if (
    transactionStatus === "cancel" ||
    transactionStatus === "deny" ||
    transactionStatus === "expire"
  ) {
    bookData.status = "failed";
  } else if (transactionStatus === "pending") {
    bookData.status = "pending";
  }

  await bookData.save();

  return res.status(200).send("Payment notif berhasil");
});

// export const callbackPayment = asyncHandler(async (req, res) => {
//   const statusResponse = await snap.transaction.notification(req.body);

//   let bookId = statusResponse.book_id;
//   let transactionStatus = statusResponse.transaction_status;
//   let fraudStatus = statusResponse.fraud_status;

//   const bookData = await Book.findById(bookId);

//   if (!bookData) {
//     res.status(400);
//     throw new Error("Book tidak ditemukan");
//   }

//   // Sample transactionStatus handling logic

//   if (transactionStatus == "capture" || transactionStatus == "settlement") {
//     if (fraudStatus == "accept") {
//       const bookLapangan = bookData.itemsDetail;

//       for (const itemLapangan of bookLapangan) {
//         const lapanganData = await Lapangan.findById(itemLapangan.lapangan);

//         if (!lapanganData) {
//           res.status(400);
//           throw new Error("Lapangan tidak ditemukan");
//         }
//         lapanganData.stock = lapanganData.stock - itemLapangan.quantity;

//         await lapanganData.save();
//       }

//       bookData.status = "success";
//     }
//   } else if (
//     transactionStatus == "cancel" ||
//     transactionStatus == "deny" ||
//     transactionStatus == "expire"
//   ) {
//     // TODO set transaction status on your database to 'failure'
//     // and response with 200 OK

//     bookData.status = "failed";
//   } else if (transactionStatus == "pending") {
//     // TODO set transaction status on your database to 'pending' / waiting payment
//     // and response with 200 OK
//     bookData.status = "pending";
//   }

//   await bookData.save();

//   return res.status(200).send("Payment notif berhasil");
// });
