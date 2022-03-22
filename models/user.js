const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const bcrypt = require("bcryptjs");
const UserSchema = new Schema(
  {
    email: {
      type: String,
      unique: true,
    },
    name: {
      type: String,
      unique: true,
    },
 
  },
);

module.exports = User = mongoose.model("User", UserSchema);
