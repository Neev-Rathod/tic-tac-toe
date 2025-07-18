const express = require("express");
const auth = require("../middleware/auth");
const User = require("../models/User");

const router = express.Router();

// Get user game history
router.get("/history", auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    res.json(user.games);
  } catch (error) {
    res.status(500).send("Error fetching history");
  }
});

// Get all users for room permissions
router.get("/", auth, async (req, res) => {
  try {
    const users = await User.find({}, { username: 1, _id: 0 });
    const usernames = users.map((user) => user.username);
    res.json(usernames);
  } catch (error) {
    res.status(500).send("Error fetching users");
  }
});

module.exports = router;
