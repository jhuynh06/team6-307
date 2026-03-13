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

const storeSchema = new mongoose.Schema({
  name: String,
  hours: String,
  rating: { type: Number, default: 0 },
  reviewCount: { type: Number, default: 0 },
  isOpen: { type: Boolean, default: true },
  bannerImage: { type: String, default: "" },
  cardImage: { type: String, default: "" },
  profileImage: { type: String, default: "" },
  products: [productSchema]
});

const Store = mongoose.model("Store", storeSchema);

export default Store;
