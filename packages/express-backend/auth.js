import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      trim: true,
      unique: true
    },
    hashedPassword: {
      type: String,
      required: true
    },
    fullName: {
      type: String,
      trim: true,
      default: ""
    },
    pronouns: {
      type: String,
      trim: true,
      default: ""
    },
    schoolYear: {
      type: String,
      trim: true,
      default: ""
    },
    major: {
      type: String,
      trim: true,
      default: ""
    },
    bio: {
      type: String,
      trim: true,
      default: ""
    }
  },
  { collection: "users" }
);

const User = mongoose.model("User", userSchema);

function generateAccessToken(username) {
  return new Promise((resolve, reject) => {
    jwt.sign(
      { username: username },
      process.env.TOKEN_SECRET,
      { expiresIn: "1d" },
      (error, token) => {
        if (error) {
          reject(error);
        } else {
          resolve(token);
        }
      }
    );
  });
}

export function registerUser(req, res) {
  const { username, pwd } = req.body;

  if (!username || !pwd) {
    return res.status(400).send("Bad request: Invalid input data.");
  }

  User.findOne({ username: username })
    .then((existingUser) => {
      if (existingUser) {
        return res.status(409).send("Username already taken.");
      }
      return bcrypt
        .genSalt(10)
        .then((salt) => bcrypt.hash(pwd, salt))
        .then((hashedPassword) => {
          const user = new User({ username, hashedPassword });
          return user.save();
        })
        .then(() => generateAccessToken(username))
        .then((token) => {
          res.status(201).send({ token: token });
        });
    })
    .catch((error) => {
      console.log(error);
      res.status(500).send("Internal server error.");
    });
}

export function loginUser(req, res) {
  const { username, pwd } = req.body;

  if (!username || !pwd) {
    return res.status(400).send("Bad request: Invalid input data.");
  }

  User.findOne({ username: username })
    .then((retrievedUser) => {
      if (!retrievedUser) {
        return res.status(401).send("Unauthorized: No such user.");
      }
      return bcrypt
        .compare(pwd, retrievedUser.hashedPassword)
        .then((matched) => {
          if (!matched) {
            return res.status(401).send("Unauthorized: Wrong password.");
          }
          return generateAccessToken(username).then((token) => {
            res.status(200).send({ token: token });
          });
        });
    })
    .catch((error) => {
      console.log(error);
      res.status(500).send("Internal server error.");
    });
}

export function authenticateUser(req, res, next) {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    return res.status(401).send("No token provided.");
  }

  jwt.verify(token, process.env.TOKEN_SECRET, (error, decoded) => {
    if (error) {
      return res.status(401).send("Invalid token.");
    }
    req.username = decoded.username;
    next();
  });
}

export { User };
