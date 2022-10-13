const router = require("express").Router();
const User = require("../models/User");
const CryptoJS = require("crypto-js");
const jwt = require("jsonwebtoken");

//Register
router.post("/register", async (req, res) => {
  const newUser = new User({
    username: req.body.username,
    email: req.body.email,
    password: CryptoJS.AES.encrypt(
      req.body.password,
      process.env.PASS_SEC
    ).toString(),
  });

  try {
    const savedUser = await newUser.save();
    console.log(savedUser);
    res.status(201).json(savedUser);
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});

//Login
router.post("/login", (req, res) => {
  User.findOne({ username: req.body.username })
    .then((user) => {
      if (!user) {
        return res.status(401).json({
          code: "401",
          message: "User not found",
        });
      }
      return user;
    })
    .then((user) => {
      console.log(user);
      if (!user) {
        return res.status(401).json({
          code: "401",
          message: "Authentication failed",
        });
      }
      const hashedPassword = CryptoJS.AES.decrypt(
        user.password,
        process.env.PASS_SEC
      );
      const orgpassword = hashedPassword.toString(CryptoJS.enc.Utf8);

      orgpassword !== req.body.password &&
        res.status(401).json({
          code: "401",
          message: "Authentication failed",
        });

      const accessToken = jwt.sign(
        {
          id: user._id,
          isAdmin: user.isAdmin,
        },
        process.env.JWT_SEC,
        {expiresIn:"3d"}
      );
      const { password, ...others } = user._doc;

      res.status(200).json({
        code: "200",
        message: "Login successful",
        user: others,
        accessToken:accessToken
      });
    })
    .catch((err) => {
      console.log(err);
    });
});

module.exports = router;
