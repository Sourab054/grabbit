const mongoose = require("mongoose");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const Product = require("./models/Product");
const User = require("./models/User");
const products = require("./data/products");
const Cart = require("./models/Cart");

dotenv.config();
connectDB();

const seedData = async () => {
  try {
    await Product.deleteMany();
    await User.deleteMany();
    await Cart.deleteMany();

    const adminUser = await User.create({
      name: "Admin",
      email: "admin123@gmail.com",
      password: "Admin1234",
      role: "admin",
    });
    const adminUserId = adminUser._id;

    const sampleProducts = products.map((product) => ({
      ...product,
      user: adminUserId,
    }));
    await Product.insertMany(sampleProducts);
    console.log("Data seeded successfully!");
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
};
seedData();
