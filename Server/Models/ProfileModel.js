const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const profileSchema = new mongoose.Schema({
  name: { type: String, required: true },
  userId: { type: Schema.Types.ObjectId, ref: "User" },
  avatar: { type: String },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Profile", profileSchema);
