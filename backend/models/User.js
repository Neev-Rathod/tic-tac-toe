const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  username: { type: String, unique: true },
  password: String,
  games: [
    {
      opponent: String,
      result: String, // 'win', 'loss', 'draw'
      steps: [
        {
          cell: Number,
          player: String,
          symbol: String,
          moveNum: Number,
        },
      ],
      winner: String, // actual winner's username or null for draw
      createdAt: { type: Date, default: Date.now },
    },
  ],
});

module.exports = mongoose.model("User", UserSchema);
