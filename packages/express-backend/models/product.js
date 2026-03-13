import mongoose from "mongoose";

const reviewSchema = new mongoose.Schema({
  user: String,
  text: String,
  rating: Number,
  date: { type: Date, default: Date.now }
});

const productSchema = new mongoose.Schema({
  name: String,
  category: String,
  inStock: { type: Boolean, default: true },
  description: String,
  tags: [String],
  reviews: [reviewSchema]
});

const Product = mongoose.model("Product", productSchema);

export default Product;
