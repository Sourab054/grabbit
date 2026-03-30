const express = require("express");
const { protect, admin } = require("../middlewares/authMiddleware");
const Product = require("../models/Product");

const router = express.Router();

// @route GET /api/admin/products
// @desc Get all products
// @access Private/Admin
router.get("/", protect, admin, async (req, res) => {
  try {
    const products = await Product.find({});
    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

// @route POST /api/admin/products
// @desc Create a new product
// @access Private/Admin
router.post("/", protect, admin, async (req, res) => {
  try {
    const {
      name,
      price,
      description,
      countInStock,
      sku,
      category,
      brand,
      sizes,
      colors,
      collections,
      material,
      gender,
      images,
    } = req.body;

    const product = new Product({
      name,
      price: Number(price),
      description,
      countInStock: Number(countInStock),
      sku,
      category,
      brand,
      sizes,
      colors,
      collections,
      material,
      gender,
      images,
      user: req.user._id,
    });

    const createdProduct = await product.save();
    res.status(201).json(createdProduct);
  } catch (error) {
    console.error("Product Creation Error:", error);
    if (error.name === "ValidationError") {
      return res.status(400).json({ message: "Validation Error", details: error.message });
    }
    if (error.code === 11000) {
      return res.status(400).json({ message: "A product with this SKU already exists" });
    }
    res.status(500).json({ message: "Internal Server Error", error: error.message });
  }
});

module.exports = router;
