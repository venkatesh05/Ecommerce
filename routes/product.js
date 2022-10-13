const router = require("express").Router();
const Product = require("../models/Product");
const {
  verifyTokenAndAuthosization,
  verifyTokenAndAdmin,
} = require("./verifyToken");

router.post("/", verifyTokenAndAdmin, async (req, res, next) => {
  const newProduct = new Product(req.body);

  try {
    const savedProduct = await newProduct.save();
    res.status(200).json({
      code: "200",
      message: "Product saved successfully",
      product: savedProduct,
    });
  } catch (err) {
    res
      .status(500)
      .json({ code: "500", message: "Internal Server Error", error: err });
  }
});

router.put("/:id", verifyTokenAndAdmin, (req, res, next) => {
  const updatedProduct = Product.findByIdAndUpdate(
    req.params.id,
    {
      $set: req.body,
    },
    { new: true }
  );
  updatedProduct.then((product) => {
    res.status(200).json({
      code: "200",
      message: "Updated Product successfully",
      product: product,
    });
  });
});

router.delete("/:id", verifyTokenAndAdmin, (req, res) => {
  Product.findByIdAndDelete(req.params.id)
    .then((user) => {
      res.status(200).json({
        code: "200",
        message: "Product has been deleted",
      });
    })
    .catch((err) => {
      res.status(500).json({
        code: "500",
        message: err,
      });
    });
});

router.get("/:id", (req, res) => {
  Product.findById(req.params.id)
    .then((product) => {
      res.status(200).json({
        code: "200",
        message: "User fetched successfully",
        product: product,
      });
    })
    .catch((err) => {
      res.status(500).json({
        code: "500",
        message: err,
      });
    });
});

router.get("/", async (req, res) => {
  const qNew = req.query.new;
  const qCategory = req.query.category;

  try {
    let products;
    if (qNew) {
      products = await Product.find().sort({ createdAt: -1 }).limit(5);
    } else if (qCategory) {
      products = await Product.find({
        categories: {
          $in: [qCategory],
        },
      });
    } else {
      products = await Product.find();
    }
    res.status(200).json({
      code: "200",
      message: "All Products fetched successfully",
      products: products,
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
