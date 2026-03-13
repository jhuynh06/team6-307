import express from "express";
import Store from "../models/store.js";
import { authenticateUser } from "../auth.js";

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const stores = await Store.find({}, { products: 0 });
    res.json(stores);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch stores" });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const store = await Store.findById(req.params.id);
    if (!store) {
      return res.status(404).json({ message: "Store not found" });
    }
    res.json(store);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch store" });
  }
});

router.get("/:id/products", async (req, res) => {
  try {
    const store = await Store.findById(req.params.id, { products: 1 });
    if (!store) {
      return res.status(404).json({ message: "Store not found" });
    }
    res.json(store.products);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch products" });
  }
});

router.get("/:storeId/products/:productId", async (req, res) => {
  try {
    const store = await Store.findById(req.params.storeId);
    if (!store) {
      return res.status(404).json({ message: "Store not found" });
    }
    const product = store.products.id(req.params.productId);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    res.json(product);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch product" });
  }
});

router.post(
  "/:storeId/products/:productId/reviews",
  authenticateUser,
  async (req, res) => {
    try {
      const { text, rating } = req.body;
      const store = await Store.findById(req.params.storeId);
      if (!store) {
        return res.status(404).json({ message: "Store not found" });
      }
      const product = store.products.id(req.params.productId);
      if (!product) {
        return res.status(404).json({ message: "Product not found" });
      }
      product.reviews.push({
        user: req.username,
        text,
        rating
      });
      await store.save();
      res.status(200).json(product);
    } catch (error) {
      res.status(500).json({ error: "Failed to save review" });
    }
  }
);

export default router;
