import mongoose from "mongoose";

const activitySchema = new mongoose.Schema({
  username: String,
  restaurantName: String,
  time: String,
  message: String,
  hasImages: Boolean,
  rating: Number,
  type: String
});

const Activity = mongoose.model("Activity", activitySchema);

export default Activity;
