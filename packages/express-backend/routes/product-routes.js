import express from "express";
import Product from "../models/product.js";
import { authenticateUser } from "../auth.js";

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch products" });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    res.json(product);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch product" });
  }
});

router.post("/:id/reviews", authenticateUser, async (req, res) => {
  try {
    const { user, text, rating } = req.body;
    const newReview = { user, text, rating };

    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id,
      { $push: { reviews: newReview } },
      { new: true }
    );

    res.status(200).json(updatedProduct);
  } catch (error) {
    res.status(500).json({ error: "Failed to save review" });
  }
});

export default router;
