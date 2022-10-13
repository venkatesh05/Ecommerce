const router = require("express").Router();
const User = require("../models/User");
const {
  verifyTokenAndAuthosization,
  verifyTokenAndAdmin,
} = require("./verifyToken");

router.put("/:id", verifyTokenAndAuthosization, (req, res, next) => {
  if (req.body.password) {
    req.body.password = CryptoJS.AES.encrypt(
      req.body.password,
      process.env.PASS_SEC
    ).toString();
  }
  const updatedUser = User.findByIdAndUpdate(
    req.params.id,
    {
      $set: req.body,
    },
    { new: true }
  );
  updatedUser.then((user) => {
    res.status(200).json({
      code: "200",
      message: "Updated user successfully",
      user: user,
    });
  });
});

router.delete("/:id", verifyTokenAndAuthosization, (req, res) => {
  User.findByIdAndDelete(req.params.id)
    .then((user) => {
      res.status(200).json({
        code: "200",
        message: "User has been deleted",
      });
    })
    .catch((err) => {
      res.status(500).json({
        code: "500",
        message: err,
      });
    });
});

router.get("/:id", verifyTokenAndAdmin, (req, res) => {
  User.findById(req.params.id)
    .then((user) => {
      const { password, ...others } = user._doc;
      res.status(200).json({
        code: "200",
        message: "User fetched successfully",
        user: others,
      });
    })
    .catch((err) => {
      res.status(500).json({
        code: "500",
        message: err,
      });
    });
});

router.get("/", verifyTokenAndAdmin, (req, res) => {
  const query = req.query.new;
  if (query) {
    User.find()
      .sort({ _id: -1 })
      .limit(5)
      .then((users) => {
        res.status(200).json({
          code: "200",
          message: "All User fetched successfully",
          users: users,
        });
      })
      .catch((err) => {
        res.status(500).json({
          code: "500",
          message: error,
        });
      });
  } else {
    User.find()
      .then((users) => {
        res.status(200).json({
          code: "200",
          message: "All User fetched successfully",
          users: users,
        });
      })
      .catch((err) => {
        res.status(500).json({
          code: "500",
          message: err,
        });
      });
  }
});

router.get("/stats", verifyTokenAndAdmin, (req, res) => {
  const date = new Date();
  const lastYear = new Date(date.setFullYear(date.getFullYear() - 1));

  User.aggregate([
    { $match: { createdAt: { $gte: lastYear } } },
    {
      $project: {
        month: { $month: "$createdAt" },
      },
    },
    {
      $group: {
        _id: "$month",
        total: { $sum: 1 },
      },
    },
  ])
    .then((data) => {
      res.status(200).json({
        code: "200",
        message: "User Stats",
        data: data,
      });
    })
    .catch((err) => {
      res.status(500).json({
        code: "500",
        message: "User Stats not found",
      });
    });
});

module.exports = router;
