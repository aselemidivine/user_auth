/* eslint-disable import/prefer-default-export */
const Cloudinary = require('cloudinary');
const { Product }  = require("../model/productModel");
require('dotenv/config');

//clodinary configuration
//create a cloudinary account and get this keys.
const cloudinary = Cloudinary.v2;
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET,
});

//create product funtion
module.exports.createProduct = async (req, res) => {
  try {
    const {
      title,
      price,
      description,
      categoryId,
    } = req.body;

    const uploadedImage = await cloudinary.uploader.upload(req.files[0].path);
    const uploadedSecondImage = await cloudinary.uploader.upload(req.files[1].path);
    const uploadedThirdImage = await cloudinary.uploader.upload(req.files[2].path);
    const item = await Product.create({
      title,
      price,
      description,
      categoryId,
      imageUrl: uploadedImage.secure_url,
      secondImageUrl: uploadedSecondImage.secure_url,
      thirdImageUrl: uploadedThirdImage.secure_url,
      userId: req.user.id, //creatorId
    });
    return res.status(201).json({
      message: 'Book Created Succesfully',
      item
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: 'Error occured while creating the product' });
  }
};


//get one product funtion
module.exports.getOneProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const singleProduct = await Product.findById(id);
    return res.status(200).json({ message: singleProduct });
  } catch (err) {
    return res.status(500).json({ message: err });
  }
};

//get a specific user product
module.exports.getUserProducts = async (req, res) => {
  try {
    const userProduct = await Product.find({ userId: req.user.id});
    return res.status(200).json({ userProduct });
  } catch (err) {
    return res.status(500).json({ message: err });
  }
};

//get all product funtion
module.exports.getAllProduct = async (req, res) => {
  try {
    const allProducts = await Product.find({});
    return res.status(200).json({ allProducts });
  } catch (err) {
    return res.status(500).json({ message: err });
  }
};

module.exports.modifyProduct = async (req, res) => {
  try {
    const { id } = req.params;
    if (!req.body) {
      return res.status(400).send({
        message: "Data to update can not be empty!"
      });
    } 
    await Product.findByIdAndUpdate(id, req.body, { useFindAndModify: false });
    return res.status(200).json({ message: "Product was updated successfully." })

  } catch (err) {
    return res.status(500).json({ message: err });
  }
}

//delete a product funtion
module.exports.deleteBook = async (req, res) => {
  try {
    const { id } = req.params;
    await Product.findByIdAndRemove(id);
    return res.status(200).json({ message: 'Product has been deleted sucessfully' });
  } catch (err) {
    return res.status(500).json({ message: err });
  }
};