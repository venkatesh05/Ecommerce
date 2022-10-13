const router = require("express").Router();
const Order = require("../models/Order");
const {
  verifyTokenAndAuthosization,
  verifyTokenAndAdmin,
} = require("./verifyToken");

router.post("/", verifyTokenAndAuthosization, async (req, res, next) => {
  const newOrder = new Order(req.body);

  try {
    const savedOrder = await newOrder.save();
    res.status(200).json({
      code: "200",
      message: "Order saved successfully",
      order: savedOrder,
    });
  } catch (err) {
    res
      .status(500)
      .json({ code: "500", message: "Internal Server Error", error: err });
  }
});

router.put("/:id", verifyTokenAndAuthosization, (req, res, next) => {
  const updatedOrder = Order.findByIdAndUpdate(
    req.params.id,
    {
      $set: req.body,
    },
    { new: true }
  );
  updatedOrder.then((order) => {
    res.status(200).json({
      code: "200",
      message: "Updated Product successfully",
      order: order,
    });
  });
});

router.delete("/:id", verifyTokenAndAdmin, (req, res) => {
    Order.findByIdAndDelete(req.params.id)
    .then((user) => {
      res.status(200).json({
        code: "200",
        message: "Order has been deleted",
      });
    })
    .catch((err) => {
      res.status(500).json({
        code: "500",
        message: err,
      });
    });
});

router.get("/:userId",verifyTokenAndAuthosization, (req, res) => {
    Order.find({userId:req.params.id})
    .then((orders) => {
      res.status(200).json({
        code: "200",
        message: "Orders fetched successfully",
        orders: orders,
      });
    })
    .catch((err) => {
      res.status(500).json({
        code: "500",
        message: err,
      });
    });
});

router.get("/",verifyTokenAndAdmin, async (req, res) => {
    try {
      let orders = await Order.find();
      res.status(200).json({
        code: "200",
        message: "All Order fetched successfully",
        orders: orders,
      });
    } catch (err) {
      res.status(500).json({
        code: "500",
        message: "Internal Server Error",
        error: err,
      });
    }
  });

module.exports = router;
