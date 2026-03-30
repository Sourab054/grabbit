const express = require("express");
const { protect } = require("../middlewares/authMiddleware");
const Checkout = require("../models/Checkout");
const Order = require("../models/Order");
const Cart = require("../models/Cart");

const router = express.Router();

// @route POST /api/checkout
// @desc Create a new checkout session and add items to it.
// @access Private
router.post("/", protect, async (req, res) => {
  try {
    const { checkoutItems, paymentMethod, totalPrice, shippingAddress } =
      req.body;

    if (!checkoutItems || checkoutItems.length === 0)
      return res.status(400).json({ message: "No items in checkout" });
    const session = await Checkout.create({
      user: req.user._id,
      checkoutItems,
      paymentMethod,
      totalPrice,
      paymentStatus: "pending",
      isPaid: false,
      shippingAddress,
    });
    res.status(201).json(session);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server error" });
  }
});

// @route PUT /api/checkout/:id/pay
// @desc Update checkout session to paid after successful payment
// @access Private
router.put("/:id/pay", protect, async (req, res) => {
  const { paymentStatus, paymentDetails } = req.body;
  try {
    const checkout = await Checkout.findById(req.params.id);
    if (!checkout)
      return res.status(404).json({ message: "No checkout session found" });

    if (paymentStatus === "paid") {
      checkout.paymentStatus = paymentStatus;
      checkout.isPaid = true;
      checkout.paidAt = Date.now();
      checkout.paymentDetails = paymentDetails;
      await checkout.save();
      res.status(200).json(checkout);
    } else {
      return res.status(400).json({ message: "Invalid payment status" });
    }
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

// @route POST /api/checkout/:id/finalize
// @desc Update checkout session to finalized after successful payment and order creation.
// @access Private
router.post("/:id/finalize", protect, async (req, res) => {
  try {
    const checkout = await Checkout.findById(req.params.id);
    if (!checkout)
      return res.status(404).json({ message: "No checkout session found" });
    console.log(checkout, "CHECKOUT");

    if (!checkout.isFinalized && checkout.isPaid) {
      const finalOrder = await Order.create({
        user: req.user._id,
        orderItems: checkout.checkoutItems,
        shippingAddress: checkout.shippingAddress,
        paymentMethod: checkout.paymentMethod,
        totalPrice: checkout.totalPrice,
        isPaid: checkout.isPaid,
        paidAt: checkout.paidAt,
        paymentStatus: checkout.paymentStatus,
        paymentDetails: checkout.paymentDetails,
        isDelivered: checkout.isDelivered,
        deliveredAt: checkout.deliveredAt,
        status: checkout.status,
      });
      checkout.isFinalized = true;
      checkout.finalizedAt = Date.now();
      await checkout.save();

      await Cart.findOneAndDelete({ user: req.user._id });
      res.status(200).json(finalOrder);
    } else if (checkout.isFinalized) {
      return res.status(400).json({ message: "Checkout already finalized" });
    } else {
      res.status(400).json({ message: "Checkout not paid" });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
