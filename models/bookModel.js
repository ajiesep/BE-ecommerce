import mongoose from "mongoose";
const { Schema } = mongoose;

const singleLapangan = Schema({
  name: { type: String, required: true },
  quantity: { type: Number, required: true },
  price: { type: Number, required: true },
  lapangan: {
    type: mongoose.Schema.ObjectId,
    ref: "Lapangan",
    required: true,
  },
});

const bookSchema = new Schema({
  total: {
    type: Number,
    required: [true, "Total is required"],
  },
  itemsDetail: [singleLapangan],
  user: {
    type: Schema.ObjectId,
    ref: "User",
    required: true,
  },
  status: {
    type: String,
    enum: ["pending", "success", "failed"],
    default: "pending",
  },
  firstName: {
    type: String,
    required: [true, "First Name is required"],
  },
  lastName: {
    type: String,
    required: [true, "Last Name is required"],
  },
  phone: {
    type: String,
    required: [true, "Phone Name is required"],
  },
  email: {
    type: String,
    required: [true, "Email Name is required"],
  },
});

const Book = mongoose.model("Book", bookSchema);

export default Book;
