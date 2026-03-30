const express = require("express");
const Product = require("../models/Product");
const Cart = require("../models/Cart");
const { protect } = require("../middlewares/authMiddleware");

const router = express.Router();

const getCart = async (userId, guestId) => {
  if (userId) return await Cart.findOne({ user: userId });
  else return await Cart.findOne({ guestId: guestId });
};

// @route POST /api/cart
// @desc Add a product to the cart
// @access Public
router.post("/", async (req, res) => {
  try {
    const { productId, userId, guestId, quantity, size, color } = req.body;
    const product = await Product.findById(productId);
    if (!product) return res.status(404).json({ message: "Product not found" });

    let cart = await getCart(userId, guestId);
    if (cart) {
      const productIndex = cart.products.findIndex(
        (p) =>
          p.productId.toString() === productId &&
          p.size === size &&
          p.color === color,
      );
      if (productIndex !== -1) {
        cart.products[productIndex].quantity += Number(quantity);
      } else {
        cart.products.push({
          productId,
          name: product.name,
          image: product.images[0].url,
          price: product.price,
          size,
          color,
          quantity,
        });
      }
      // Recalculate totalPrice for all cases
      cart.totalPrice = cart.products.reduce(
        (acc, curr) => acc + Number(curr.price) * Number(curr.quantity),
        0,
      );
      await cart.save();
      res.status(201).json(cart);
    } else {
      const cart = await Cart.create({
        user: userId ? userId : undefined,
        guestId: guestId ? guestId : "guest_" + new Date().getTime(),
        totalPrice: product.price * quantity,
        products: [
          {
            productId,
            name: product.name,
            image: product.images[0].url,
            price: product.price,
            size,
            color,
            quantity,
          },
        ],
      });

      await cart.save();
      res.status(201).json(cart);
    }
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
});

// @route PUT /api/cart
// @desc Update quantity in the cart
// @access Public
router.put("/", async (req, res) => {
  try {
    const { productId, userId, guestId, quantity, size, color } = req.body;
    let cart = await getCart(userId, guestId);
    if (!cart) return res.status(404).json({ message: "Cart not found" });
    const productIndex = cart.products.findIndex(
      (p) =>
        p.productId.toString() === productId &&
        p.size === size &&
        p.color === color,
    );

    if (productIndex === -1) {
      return res.status(404).json({ message: "Product not found in cart" });
    }

    if (quantity > 0) {
      cart.products[productIndex].quantity = quantity;
    } else {
      cart.products.splice(productIndex, 1);
    }
    cart.totalPrice = cart.products.reduce(
      (acc, curr) => acc + curr.price * curr.quantity,
      0,
    );
    await cart.save();
    res.status(200).json(cart);
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
});

// @route DELETE /api/cart
// @desc Delete a product from cart
// @access Public
router.delete("/", async (req, res) => {
  try {
    const { productId, userId, guestId, quantity, size, color } = req.body;
    let cart = await getCart(userId, guestId);
    if (!cart) return res.status(404).json({ message: "Cart not found" });
    const productIndex = cart.products.findIndex(
      (p) =>
        p.productId.toString() === productId &&
        p.size === size &&
        p.color === color,
    );

    if (productIndex === -1) {
      return res.status(404).json({ message: "Product not found in cart" });
    }
    cart.products.splice(productIndex, 1);
    cart.totalPrice = cart.products.reduce(
      (acc, curr) => acc + curr.price * curr.quantity,
      0,
    );
    await cart.save();
    res.status(200).json(cart);
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
});

// @route GET /api/cart
// @desc Retrieve cart items
// @access Public
router.get("/", async (req, res) => {
  try {
    const { userId, guestId } = req.query;
    let cart = await getCart(userId, guestId);
    if (!cart) return res.status(404).json({ message: "Cart not found" });
    res.status(200).json(cart);
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
});

// @route POST /api/cart/merge
// @desc Merge guest cart into user cart
// @access Private
router.post("/merge", protect, async (req, res) => {
  try {
    const { guestId } = req.body;
    const userCart = await Cart.findOne({ user: req.user._id });
    const guestCart = await Cart.findOne({ guestId });
    if (!guestCart) return res.status(404).json({ message: "Cart not found" });
    if (userCart) {
      guestCart.products.forEach((product) => {
        const productIndex = userCart.products.findIndex(
          (p) =>
            p.productId.toString() === product.productId &&
            p.size === product.size &&
            p.color === product.color,
        );
        if (productIndex !== -1) {
          userCart.products[productIndex].quantity += Number(product.quantity);
        } else {
          userCart.products.push(product);
        }
      });
      userCart.totalPrice = userCart.products.reduce(
        (acc, curr) => acc + Number(curr.price) * Number(curr.quantity),
        0,
      );
      await userCart.save();
      await guestCart.remove();
      res.status(200).json(userCart);
    } else {
      guestCart.user = req.user._id;
      guestCart.guestId = undefined;
      await guestCart.save();
      res.status(200).json(guestCart);
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server Error" });
  }
});

module.exports = router;
