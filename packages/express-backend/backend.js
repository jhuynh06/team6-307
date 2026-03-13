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
  const id = req.params["id"];
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

/*---------------Review section--------------------*/
const reviewSchema = new mongoose.Schema({
  user: String,
  text: String,
  rating: Number,
  date: { type: Date, default: Date.now }
});

//Product subsection//

const productSchema = new mongoose.Schema({
  name: String,
  category: String,
  inStock: Boolean,
  description: String,
  reviews: [reviewSchema]
});

const Product = mongoose.model("Product", productSchema);

app.get("/products", async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch products" });
  }
});

app.post("/products/:id/reviews", async (req, res) => {
  try {
    const { user, text, rating } = req.body;
    const productId = req.params.id;

    const newReview = { user, text, rating };

    const updatedProduct = await Product.findByIdAndUpdate(
      productId,
      { $push: { reviews: newReview } },
      { new: true }
    );

    res.status(200).json(updatedProduct);
  } catch (error) {
    res.status(500).json({ error: "Failed to save review" });
  }
});

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

app.get("/seed", async (req, res) => {
  try {
    const newProduct = new Product({
      name: "Bishop Burger",
      category: "Meals",
      inStock: true,
      description:
        "The classic campus burger with double cheese and secret sauce.",
      reviews: []
    });

    const savedProduct = await newProduct.save();
    res.json(savedProduct);
  } catch (error) {
    res.status(500).json({ error: "Failed to create product" });
  }
});

//lol

/*---------------HOMEPAGE--------------------*/

/*///////////////Recent Activity/////////////*/

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

app.get("/activity", async (req, res) => {
  try {
    const activities = await Activity.find({
      type: "announcement"
    });
    res.json(activities);
  } catch (error) {
    res
      .status(500)
      .json({ error: "Failed to fetch activity feed" });
  }
});

app.get("/activity/user/:username", async (req, res) => {
  try {
    const targetUser = req.params.username;
    const userPosts = await Activity.find({
      username: targetUser
    });

    //MOCK DATA!!!!
    const userStats = { rated: 1, saved: 3, tried: 5 };

    res.json({ stats: userStats, posts: userPosts });
  } catch (error) {
    res
      .status(500)
      .json({ error: "Failed to fetch user profile data" });
  }
});

app.get("/seed-activity", async (req, res) => {
  try {
    await Activity.deleteMany({});

    //MOCK POSTS!!!
    const testPosts = [
      {
        username: "linan",
        restaurantName: "VG",
        time: "10 mins ago",
        message: "Good pasta!!!",
        hasImages: false,
        rating: 4,
        type: "review"
      },
      {
        username: "campusdining",
        restaurantName: "Campus Dining",
        time: "1 hour ago",
        message: "Come try da goods!",
        hasImages: false,
        rating: null,
        type: "announcement"
      },
      {
        username: "subwayslo",
        restaurantName: "Subway",
        time: "3 hours ago",
        message: "Closing early today.",
        hasImages: false,
        rating: null,
        type: "announcement"
      }
    ];

    await Activity.insertMany(testPosts);
    res.json({
      message: "Activity feed seeded successfully",
      testPosts
    });
  } catch (error) {
    res
      .status(500)
      .json({ error: "Failed to seed activities" });
  }
});

app.get("/users/search", authenticateUser, async (req, res) => {
  const query = req.query.q;
  try {
    const users = await User.find({
      $or: [
        { username: { $regex: query, $options: "i" } },
        { fullName: { $regex: query, $options: "i" } }
      ]
    }).select("username fullName major");
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: "Search failed" });
  }
});
