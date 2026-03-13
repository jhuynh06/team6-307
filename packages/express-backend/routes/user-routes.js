import express from "express";
import { authenticateUser, User } from "../auth.js";
import userServices from "../services/user-service.js";

const router = express.Router();

// Profile
router.get("/profile", authenticateUser, (req, res) => {
  User.findOne({ username: req.username })
    .then((user) => {
      if (!user) {
        return res.status(404).send("User not found.");
      }
      const { fullName, pronouns, schoolYear, major, bio } = user;
      res.send({ fullName, pronouns, schoolYear, major, bio });
    })
    .catch((error) => {
      console.error(error);
      res.status(500).send("Internal server error.");
    });
});

router.put("/profile", authenticateUser, (req, res) => {
  const { fullName, pronouns, schoolYear, major, bio } = req.body;
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
      console.error(error);
      res.status(500).send("Internal server error.");
    });
});

// Users CRUD
router.get("/users", authenticateUser, (req, res) => {
  const name = req.query.name;
  const job = req.query.job;
  userServices
    .getUsers(name, job)
    .then((result) => res.send(result))
    .catch((err) => {
      console.error(err);
      res.status(500).send("Internal server error.");
    });
});

router.get("/users/:id", authenticateUser, (req, res) => {
  const id = req.params["id"];
  userServices
    .findUserById(id)
    .then((result) => res.send(result))
    .catch((err) => res.status(404).send("Resource not found."));
});

router.post("/users", authenticateUser, (req, res) => {
  const userToAdd = req.body;
  userServices
    .addUser(userToAdd)
    .then((newUser) => res.status(201).send({ newUser }))
    .catch((err) => {
      console.error(err);
      res.status(500).send("Internal server error.");
    });
});

router.delete("/users/:id", authenticateUser, (req, res) => {
  const id = req.params["id"];
  userServices
    .removeUser(id)
    .then((_) => res.status(204).send())
    .catch((err) => res.status(404).send("Resource not found."));
});

// Search
router.get("/users/search", authenticateUser, async (req, res) => {
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

export default router;
