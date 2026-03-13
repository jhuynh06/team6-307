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
  inStock: Boolean,
  description: String,
  reviews: [reviewSchema]
});

const Product = mongoose.model("Product", productSchema);

export default Product;
