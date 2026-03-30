const mongoose = require("mongoose");

const subscriberSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      trim: true,
      unique: true,
      lowercase: true,
      match: [
        /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
        "Please enter a valid e-mail address",
      ],
    },
    subscribedAt: {
      type: Date,
      default: Date.now(),
    },
  },
  { timestamps: true },
);

module.exports = mongoose.model("Subscriber", subscriberSchema);
