const express = require("express");
const auth = require("../middleware/auth");
const User = require("../models/User");

const router = express.Router();

// Save game result
router.post("/save", auth, async (req, res) => {
  const { opponent, result, steps, winner } = req.body;

  try {
    await User.findByIdAndUpdate(req.user.id, {
      $push: {
        games: {
          opponent,
          result,
          steps,
          winner: winner || null,
        },
      },
    });

    res.json({ success: true });
  } catch (error) {
    res.status(500).send("Error saving game");
  }
});

module.exports = router;
