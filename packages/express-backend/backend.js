import express from "express";
import cors from "cors";
import userServices from "./services/user-service.js";
import dotenv from "dotenv";
import mongoose from "mongoose";
import {
  registerUser,
  loginUser,
  authenticateUser,
  User
} from "./auth.js";

dotenv.config();

const { MONGO_CONNECTION_STRING } = process.env;

mongoose.set("debug", true);

mongoose
  .connect(process.env.MONGO_CONNECTION_STRING)
  .then(() => console.log("Successfully connected to MongoDB!"))
  .catch((error) => console.log(error));

const app = express();
const port = 8000;

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.listen(process.env.PORT || port, () => {
  console.log("REST API is listening.");
});

app.post("/signup", registerUser);
app.post("/login", loginUser);

app.get("/profile", authenticateUser, (req, res) => {
  User.findOne({ username: req.username })
    .then((user) => {
      if (!user) {
        return res.status(404).send("User not found.");
      }
      const { fullName, pronouns, schoolYear, major, bio } =
        user;
      res.send({ fullName, pronouns, schoolYear, major, bio });
    })
    .catch((error) => {
      console.log(error);
      res.status(500).send("Internal server error.");
    });
});

app.put("/profile", authenticateUser, (req, res) => {
  const { fullName, pronouns, schoolYear, major, bio } =
    req.body;
  User.findOneAndUpdate(
    { username: req.username },
    { fullName, pronouns, schoolYear, major, bio },
    { new: true }
  )
    .then((user) => {
      if (!user) {
        return res.status(404).send("User not found.");
      }
      res.send({
        fullName: user.fullName,
        pronouns: user.pronouns,
        schoolYear: user.schoolYear,
        major: user.major,
        bio: user.bio
      });
    })
    .catch((error) => {
      console.log(error);
      res.status(500).send("Internal server error.");
    });
});

app.get("/users", authenticateUser, (req, res) => {
  const name = req.query.name;
  const job = req.query.job;
  userServices
    .getUsers(name, job)
    .then((result) => res.send(result));
});

app.get("/users/:id", authenticateUser, (req, res) => {
  const id = req.params["id"]; //or req.params.id
  userServices
    .findUserById(id)
    .then((result) => res.send(result))
    .catch((err) =>
      res.status(404).send("Resource not found.")
    );
});

app.post("/users", authenticateUser, (req, res) => {
  const userToAdd = req.body;
  userServices
    .addUser(userToAdd)
    .then((newUser) => res.status(201).send({ newUser }));
});

app.delete("/users/:id", authenticateUser, (req, res) => {
  const id = req.params["id"];
  userServices
    .removeUser(id)
    .then((_) => res.status(204).send())
    .catch((err) =>
      res.status(404).send("Resource not found.")
    );
});
//Review Section
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

// GET a specific product and its reviews
app.get("/products/:id", async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res
        .status(404)
        .json({ message: "Product not found" });
    }
    res.json(product);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch product" });
  }
});

// POST a new review to a product
app.post("/products/:id/reviews", async (req, res) => {
  try {
    const { user, text, rating } = req.body;
    const productId = req.params.id;

    // Create the new review object
    const newReview = { user, text, rating };

    // Find the product and push the new review into its array
    const updatedProduct = await Product.findByIdAndUpdate(
      productId,
      { $push: { reviews: newReview } },
      { new: true } // Returns the updated document
    );

    res.status(200).json(updatedProduct);
  } catch (error) {
    res.status(500).json({ error: "Failed to save review" });
  }
});

//End of review section

// TEMPORARY ROUTE to create our first product
app.get("/seed", async (req, res) => {
  try {
    const newProduct = new Product({
      name: "Bishop Burger",
      category: "Meals",
      inStock: true,
      description:
        "The classic campus burger with double cheese and secret sauce.",
      reviews: [] // Starts with empty reviews
    });

    const savedProduct = await newProduct.save();
    res.json(savedProduct);
  } catch (error) {
    res.status(500).json({ error: "Failed to create product" });
  }
});

//lol
