import express from "express";
import Activity from "../models/activity.js";

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const activities = await Activity.find({ type: "announcement" });
    res.json(activities);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch activity feed" });
  }
});

router.get("/user/:username", async (req, res) => {
  try {
    const userPosts = await Activity.find({
      username: req.params.username
    });

    const userStats = { rated: 1, saved: 3, tried: 5 };

    res.json({ stats: userStats, posts: userPosts });
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch user profile data" });
  }
});

export default router;
