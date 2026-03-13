import mongoose from "mongoose";

const storeSchema = new mongoose.Schema({
  name: String,
  hours: String,
  rating: { type: Number, default: 0 },
  reviewCount: { type: Number, default: 0 },
  isOpen: { type: Boolean, default: true },
  bannerImage: { type: String, default: "" },
  cardImage: { type: String, default: "" },
  profileImage: { type: String, default: "" }
});

const Store = mongoose.model("Store", storeSchema);

export default Store;
