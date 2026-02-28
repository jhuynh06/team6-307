import express from "express";
import cors from "cors";
import userServices from "./services/user-service.js";
import dotenv from "dotenv";
import mongoose from "mongoose";
import { registerUser, loginUser, authenticateUser, User } from "./auth.js";

dotenv.config();

const { MONGO_CONNECTION_STRING } = process.env;

mongoose.set("debug", true);
mongoose
  .connect(MONGO_CONNECTION_STRING) // connect to Db "users"
  .catch((error) => console.log(error));

const app = express();
const port = 8000;

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.listen(port, () => {
  console.log(
    `Example app listening at http://localhost:${port}`
  );
});

app.post("/signup", registerUser);
app.post("/login", loginUser);

app.get("/profile", authenticateUser, (req, res) => {
  User.findOne({ username: req.username })
    .then((user) => {
      if (!user) {
        return res.status(404).send("User not found.");
      }
      const { fullName, pronouns, schoolYear, major, bio } = user;
      res.send({ fullName, pronouns, schoolYear, major, bio });
    })
    .catch((error) => {
      console.log(error);
      res.status(500).send("Internal server error.");
    });
});

app.put("/profile", authenticateUser, (req, res) => {
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

//lol