/* eslint-disable import/prefer-default-export */
const Cloudinary = require('cloudinary');
const { Data }  = require("../model/dataModel");
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
module.exports.createData = async (req, res) => {
  try {
    const {
      title,
      description,
    } = req.body;

    const uploadedImage = await cloudinary.uploader.upload(req.file.path);
  
    const item = await Data.create({
      title,
      description,
      url: uploadedImage.secure_url,
      creatorId: req.user.id, //creatorId
    });
    return res.status(201).json({
      message: 'Data Created Succesfully',
      item
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: 'Error occured while creating the product' });
  }
};


//get one product funtion
module.exports.getOneData = async (req, res) => {
  try {
    const { id } = req.params;
    const singleData = await Data.findById(id);
    return res.status(200).json({ message: singleData });
  } catch (err) {
    return res.status(500).json({ message: err });
  }
};

module.exports.modifyData = async (req, res) => {
  try {
    const { id } = req.params;
    if (!req.body) {
      return res.status(400).send({
        message: "Data to update can not be empty!"
      });
    } 
    await Data.findByIdAndUpdate(id, req.body, { useFindAndModify: false });
    return res.status(200).json({ message: "Data was updated successfully." })

  } catch (err) {
    return res.status(500).json({ message: err });
  }
}

//delete a product funtion
module.exports.deleteData = async (req, res) => {
  try {
    const { id } = req.params;
    await Data.findByIdAndRemove(id);
    return res.status(200).json({ message: 'Product has been deleted sucessfully' });
  } catch (err) {
    return res.status(500).json({ message: err });
  }
};