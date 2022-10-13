const router = require("express").Router();
const Cart = require("../models/Cart");
const {
  verifyTokenAndAuthosization,
  verifyTokenAndAdmin,
  verifyToken,
} = require("./verifyToken");

router.post("/", verifyToken, async (req, res, next) => {
  const newCart = new Cart(req.body);

  try {
    const savedCart = await newCart.save();
    res.status(200).json({
      code: "200",
      message: "Cart saved successfully",
      cart: savedCart,
    });
  } catch (err) {
    res
      .status(500)
      .json({ code: "500", message: "Internal Server Error", error: err });
  }
});

router.put("/:id", verifyTokenAndAuthosization, (req, res, next) => {
  const updatedCart = Cart.findByIdAndUpdate(
    req.params.id,
    {
      $set: req.body,
    },
    { new: true }
  );
  updatedCart.then((cart) => {
    res.status(200).json({
      code: "200",
      message: "Updated Cart successfully",
      cart: cart,
    });
  });
});

router.delete("/:id", verifyTokenAndAuthosization, (req, res) => {
    Cart.findByIdAndDelete(req.params.id)
    .then((user) => {
      res.status(200).json({
        code: "200",
        message: "Cart has been deleted",
      });
    })
    .catch((err) => {
      res.status(500).json({
        code: "500",
        message: err,
      });
    });
});

router.get("/:userid",verifyTokenAndAuthosization, (req, res) => {
    Cart.find({userId:req.params.id})
    .then((cart) => {
      res.status(200).json({
        code: "200",
        message: "Cart fetched successfully",
        cart: cart,
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
    let carts = await Cart.find();
    res.status(200).json({
      code: "200",
      message: "All Cart fetched successfully",
      carts: carts,
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
