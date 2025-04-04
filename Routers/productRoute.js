const express = require('express')
const route=express.Router();
const getmodel = require('../Models/Productmodel')
const upload = require('../Middleware/multerupload');
const auth = require('../Middleware/authMiddleware')
const {Createproduct,update,deleteProduct} = require('../Controllers/Productcontroller')
const {getAllProducts}= require('../Controllers/Productcontroller')

route.post('/addproduct',auth,upload.single('image'),Createproduct);
route.post('/productupdate/:id',auth,upload.single('image'),update);
route.delete('/delete/:id',auth,deleteProduct);
route.get('/myproducts', auth, async (req, res) => {
    try {
        const userId = req.user.userId; // Get user ID from token
        console.log("Fetching products for user:", userId); // Debugging

        const products = await getmodel.find({ createdBy: userId }); // Fetch user-specific products
        console.log("Products found:", products); // Debugging

        res.json(products);
    } catch (error) {
        console.error("Error fetching user products:", error);
        res.status(500).json({ message: "Server error" });
    }
});


route.get('/getall',getAllProducts)
module.exports = route;