/* eslint-disable import/prefer-default-export */
const Cloudinary = require('cloudinary');
const { Category }  = require("../model/categoryModel");
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
module.exports.createCategory = async (req, res) => {
  try {
    const {
      name,
      description,
    } = req.body;

    const uploadedImage = await cloudinary.uploader.upload(req.file.path);
  
    const item = await Category.create({
      name,
      description,
      imageUrl: uploadedImage.secure_url,
      creatorId: req.user.id, //creatorId
    });
    return res.status(201).json({
      message: 'Category Created Succesfully',
      item
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: 'Error occured while creating the product' });
  }
};


//get one product funtion
module.exports.getOneCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const singleCategory = await Category.findById(id);
    return res.status(200).json({ message: singleCategory });
  } catch (err) {
    return res.status(500).json({ message: err });
  }
};

module.exports.modifyCategory = async (req, res) => {
  try {
    const { id } = req.params;
    if (!req.body) {
      return res.status(400).send({
        message: "Data to update can not be empty!"
      });
    } 
    await Category.findByIdAndUpdate(id, req.body, { useFindAndModify: false });
    return res.status(200).json({ message: "Category was updated successfully." })

  } catch (err) {
    return res.status(500).json({ message: err });
  }
}

//delete a product funtion
module.exports.deleteCategory = async (req, res) => {
  try {
    const { id } = req.params;
    await Category.findByIdAndRemove(id);
    return res.status(200).json({ message: 'Product has been deleted sucessfully' });
  } catch (err) {
    return res.status(500).json({ message: err });
  }
};