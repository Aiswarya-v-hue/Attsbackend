const mongoose = require('mongoose')
const getmodel = require('../Models/Productmodel')

exports.Createproduct = async (req, res) => {
    try {
        console.log("Received Body:", req.body);
        console.log("Received File:", req.file);
        console.log("User ID:", req.user);

        const { name, price, stock, description, category, manufacturingDate } = req.body;

        if (!req.file) {
            return res.status(400).json({ error: "Image file is required" });
        }

        const newproduct = new getmodel({
            name,
            price,
            stock,
            description,
            category,
            manufacturingDate,
            createdBy: req.user.userId, // Fix Here
            image: req.file.filename // Fix Here
        });

        await newproduct.save();
        res.status(201).json({ message: "Product added successfully", product: newproduct });
    } catch (err) {
        console.error("Server Error:", err);
        res.status(500).json({ error: "Server error", detail: err.message });
    }
};


exports.update = async (req, res) => {
  try {
    const { id } = req.params;
    console.log("🔹 Product ID:", id);

    // Validate ID
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: "Invalid product ID format" });
    }

    console.log(" Product ID format is valid.");

    // Validate user authentication
    if (!req.user || !req.user.userId) {
      return res.status(401).json({ error: " Unauthorized: Missing user authentication." });
    }

    console.log("🔹 User ID from Token:", req.user.userId);

    // Fetch product from database
    const product = await getmodel.findById(id);
    if (!product) {
      return res.status(404).json({ error: " Product not found." });
    }

    console.log("🔹 Product Owner ID:", product.createdBy.toString());

    // Check if the logged-in user is the owner
    if (product.createdBy.toString() !== req.user.userId) {
      return res.status(403).json({ error: " Unauthorized: You can only update your own products." });
    }

    // Destructure request body
    const { name, price, stock, description, category, manufacturingDate } = req.body;
    const image = req.file ? req.file.path : product.image; // Keep old image if not updated

    console.log(" Updating fields...");

    // Update product fields
    product.name = name || product.name;
    product.price = price || product.price;
    product.stock = stock || product.stock;
    product.description = description || product.description;
    product.category = category || product.category;
    product.manufacturingDate = manufacturingDate || product.manufacturingDate;
    product.image = image;

    // Save updated product
    await product.save();

    console.log(" Product updated successfully:", product);

    return res.status(200).json({ message: " Product updated successfully", product });
  } catch (err) {
    console.error(" Error updating product:", err);
    return res.status(500).json({ error: " Server error", detail: err.message });
  }
};

exports.deleteProduct = async(req,res) =>{
    try {
        const { id } = req.params; // Get product ID from URL
console.log(id);

        const product = await getmodel.findById(id);
console.log(product);

        if (!product) {
            return res.status(404).json({ error: "Product not found" });
        }

        // Check if the logged-in user is the creator
        if (product.createdBy.toString() !== req.user.userId) {
            return res.status(403).json({ error: "Unauthorized: You can only delete your own products" });
        }

        await getmodel.findByIdAndDelete(id);

        return res.status(200).json({ message: "Product deleted successfully" });

    } catch (err) {
        console.error("Error deleting product:",err.message);
        return res.status(500).json({ error: "Server error", detail:err.message });
    }
};
// Controllers/Productcontroller.js

const Product = require('../Models/Productmodel');

exports.getAllProducts = async (req, res) => {
  try {
    const products = await Product.find().sort({ createdAt: -1 });
    return res.status(200).json(products);
  } catch (err) {
    console.error("Error fetching products:", err.message);
    return res.status(500).json({ error: "Server error while fetching products" });
  }
};
