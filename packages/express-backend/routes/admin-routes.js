import express from "express";
import multer from "multer";
import { authenticateUser, authorizeAdmin } from "../auth.js";
import { uploadToAzure } from "../services/upload-service.js";
import Store from "../models/store.js";

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

router.use(authenticateUser, authorizeAdmin);

// Upload image to Azure Blob Storage
router.post("/upload", upload.single("image"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).send("No file uploaded.");
    }
    const url = await uploadToAzure(
      req.file.buffer,
      req.file.originalname,
      req.file.mimetype
    );
    res.status(200).json({ url });
  } catch (error) {
    console.error("Upload error:", error);
    res.status(500).send("Failed to upload image.");
  }
});

// Get all products across all stores (flattened)
router.get("/products", async (req, res) => {
  try {
    const stores = await Store.find({});
    const products = [];
    for (const store of stores) {
      for (const product of store.products) {
        products.push({
          ...product.toObject(),
          storeName: store.name,
          storeId: store._id
        });
      }
    }
    res.json(products);
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal server error.");
  }
});

// Add product to a store
router.post("/stores/:storeId/products", async (req, res) => {
  try {
    const store = await Store.findById(req.params.storeId);
    if (!store) return res.status(404).send("Store not found.");
    store.products.push(req.body);
    await store.save();
    const added = store.products[store.products.length - 1];
    res.status(201).json(added);
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal server error.");
  }
});

// Update a product in a store
router.put("/stores/:storeId/products/:productId", async (req, res) => {
  try {
    const store = await Store.findById(req.params.storeId);
    if (!store) return res.status(404).send("Store not found.");
    const product = store.products.id(req.params.productId);
    if (!product) return res.status(404).send("Product not found.");
    Object.assign(product, req.body);
    await store.save();
    res.json(product);
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal server error.");
  }
});

// Delete a product from a store
router.delete("/stores/:storeId/products/:productId", async (req, res) => {
  try {
    const store = await Store.findById(req.params.storeId);
    if (!store) return res.status(404).send("Store not found.");
    const product = store.products.id(req.params.productId);
    if (!product) return res.status(404).send("Product not found.");
    product.deleteOne();
    await store.save();
    res.status(204).send();
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal server error.");
  }
});

// Get all stores (without products)
router.get("/stores", async (req, res) => {
  try {
    const stores = await Store.find({}).select("-products");
    res.json(stores);
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal server error.");
  }
});

// Create a store
router.post("/stores", async (req, res) => {
  try {
    const store = new Store(req.body);
    await store.save();
    res.status(201).json(store);
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal server error.");
  }
});

// Update a store
router.put("/stores/:storeId", async (req, res) => {
  try {
    const store = await Store.findByIdAndUpdate(req.params.storeId, req.body, {
      new: true
    });
    if (!store) return res.status(404).send("Store not found.");
    res.json(store);
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal server error.");
  }
});

// Delete a store
router.delete("/stores/:storeId", async (req, res) => {
  try {
    const store = await Store.findByIdAndDelete(req.params.storeId);
    if (!store) return res.status(404).send("Store not found.");
    res.status(204).send();
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal server error.");
  }
});

export default router;
