const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const passwordresttokenSchema = new mongoose.Schema({
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User", // Links to the User model
    required: true
  },
  token: {
    type: String,
    required: true
  },
  createdAt: {
    type: Date,
    expires: 3600, // 1-hour expiration
    default: Date.now
  }
});

// Pre-save hook to hash the token before saving it
passwordresttokenSchema.pre("save", async function (next) {
  if (this.isModified("token")) {
    this.token = await bcrypt.hash(this.token, 10);
  }
  next();
});

// Instance method to compare token
passwordresttokenSchema.methods.compareToken = async function (token) {
  return await bcrypt.compare(token, this.token);
};

module.exports = mongoose.model("Passwordresttoken", passwordresttokenSchema);
