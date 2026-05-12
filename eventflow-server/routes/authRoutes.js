const express = require("express");

const bcrypt = require("bcryptjs");

const jwt = require("jsonwebtoken");

const User = require("../models/User");

const router = express.Router();

/*
|--------------------------------------------------------------------------
| REGISTER
|--------------------------------------------------------------------------
*/

router.post(
  "/register",
  async (req, res) => {

    try {

      console.log(
        "📥 Register Request:",
        req.body
      );

      const {
        username,
        password,
      } = req.body;

      /*
      |--------------------------------------------------------------------------
      | CHECK EXISTING USER
      |--------------------------------------------------------------------------
      */

      const existingUser =
        await User.findOne({
          username,
        });

      if (existingUser) {

        return res.status(400).json({
          message:
            "User already exists",
        });
      }

      /*
      |--------------------------------------------------------------------------
      | HASH PASSWORD
      |--------------------------------------------------------------------------
      */

      const hashedPassword =
        await bcrypt.hash(
          password,
          10
        );

      /*
      |--------------------------------------------------------------------------
      | CREATE USER
      |--------------------------------------------------------------------------
      */

      const user = new User({

        username,

        password:
          hashedPassword,
      });

      await user.save();

      console.log(
        "✅ User Registered"
      );

      res.status(201).json({
        message:
          "User registered successfully",
      });

    } catch (error) {

      console.error(
        "❌ Register Error:",
        error
      );

      res.status(500).json({
        message:
          "Registration failed",
      });
    }
  }
);

/*
|--------------------------------------------------------------------------
| LOGIN
|--------------------------------------------------------------------------
*/

router.post(
  "/login",
  async (req, res) => {

    try {

      console.log(
        "📥 Login Request:",
        req.body
      );

      const {
        username,
        password,
      } = req.body;

      /*
      |--------------------------------------------------------------------------
      | FIND USER
      |--------------------------------------------------------------------------
      */

      const user =
        await User.findOne({
          username,
        });

      if (!user) {

        return res.status(400).json({
          message:
            "Invalid credentials",
        });
      }

      /*
      |--------------------------------------------------------------------------
      | CHECK PASSWORD
      |--------------------------------------------------------------------------
      */

      const isMatch =
        await bcrypt.compare(
          password,
          user.password
        );

      if (!isMatch) {

        return res.status(400).json({
          message:
            "Invalid credentials",
        });
      }

      /*
      |--------------------------------------------------------------------------
      | CREATE TOKEN
      |--------------------------------------------------------------------------
      */

      const token = jwt.sign(
        {
          userId: user._id,

          username:
            user.username,
        },

        process.env.JWT_SECRET,

        {
          expiresIn: "7d",
        }
      );

      console.log(
        "✅ Login Successful"
      );

      res.json({

        token,

        username:
          user.username,
      });

    } catch (error) {

      console.error(
        "❌ Login Error:",
        error
      );

      res.status(500).json({
        message:
          "Login failed",
      });
    }
  }
);

module.exports = router;