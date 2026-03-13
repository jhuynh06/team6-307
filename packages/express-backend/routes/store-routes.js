import express from "express";
import Store from "../models/store.js";

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const stores = await Store.find();
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

export default router;
