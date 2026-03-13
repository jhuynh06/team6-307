import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";
import { registerUser, loginUser } from "./auth.js";
import userRoutes from "./routes/user-routes.js";
import productRoutes from "./routes/product-routes.js";
import storeRoutes from "./routes/store-routes.js";
import activityRoutes from "./routes/activity-routes.js";

dotenv.config();

mongoose.set("debug", true);

mongoose
  .connect(process.env.MONGO_CONNECTION_STRING)
  .then(() => console.log("Successfully connected to MongoDB!"))
  .catch((error) => console.error(error));

const app = express();
const port = 8000;

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Hello World!");
});

// Auth
app.post("/signup", registerUser);
app.post("/login", loginUser);

// Routes
app.use("/", userRoutes);
app.use("/products", productRoutes);
app.use("/stores", storeRoutes);
app.use("/activity", activityRoutes);

app.listen(process.env.PORT || port, () => {
  console.log("REST API is listening.");
});
