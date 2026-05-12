const mongoose = require("mongoose");

/*
|--------------------------------------------------------------------------
| USER SCHEMA
|--------------------------------------------------------------------------
*/

const userSchema =
  new mongoose.Schema({

    username: {
      type: String,
      required: true,
      unique: true,
    },

    password: {
      type: String,
      required: true,
    },

  }, {
    timestamps: true,
  });

/*
|--------------------------------------------------------------------------
| EXPORT MODEL
|--------------------------------------------------------------------------
*/

const User =
  mongoose.model(
    "User",
    userSchema
  );

module.exports = User;