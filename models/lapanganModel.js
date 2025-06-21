import mongoose from "mongoose";
const { Schema } = mongoose;

const lapanganSchema = new Schema({
  name: {
    type: String,
    required: [true, "Name Lapangan is required"],
    unique: [true, "Lapangan already exists"],
  },
  price: {
    type: Number,
    required: [true, "Price is required"],
  },
  description: {
    type: String,
    required: [true, "Description Lapangan is required"],
  },
  image: {
    type: String,
    default: null,
  },
  category: {
    type: String,
    enum: ["Lapangan A", "Lapangan B", "Lapangan C", "Lapangan D"],
  },
  stock: {
    type: Number,
    default: 0,
  },
});

const Lapangan = mongoose.model("Lapangan", lapanganSchema);

export default Lapangan;
