/* eslint-disable import/prefer-default-export */
const Cloudinary = require('cloudinary');
const { Feed }  = require("../model/feedModel");
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
module.exports.createFeed = async (req, res) => {
  try {
    const {
      title,
      description,
    } = req.body;

    const uploadedImage = await cloudinary.uploader.upload(req.files[0].path);
    const uploadedVideo = await cloudinary.uploader.upload(req.files[1].path, {
      resource_type: 'video',
    });
  
    const item = await Feed.create({
      title,
      description,
      imageUrl: uploadedImage.secure_url,
      videoUrl: uploadedVideo.secure_url,
      creatorId: req.user.id, //creatorId
    });
    return res.status(201).json({
      message: 'Feed Created Succesfully',
      item
    });
  } catch (err) {
    console.log(err, 'err');
    return res.status(500).json({ message: 'Error occured while creating the product' });
  }
};


//get one product funtion
module.exports.getOneFeed = async (req, res) => {
  try {
    const { id } = req.params;
    const singleFeed = await Feed.findById(id);
    return res.status(200).json({ message: singleFeed });
  } catch (err) {
    return res.status(500).json({ message: err });
  }
};

module.exports.modifyFeed = async (req, res) => {
  try {
    const { id } = req.params;
    if (!req.body) {
      return res.status(400).send({
        message: "Data to update can not be empty!"
      });
    } 
    await Feed.findByIdAndUpdate(id, req.body, { useFindAndModify: false });
    return res.status(200).json({ message: "Feed was updated successfully." })

  } catch (err) {
    return res.status(500).json({ message: err });
  }
}

//delete a product funtion
module.exports.deleteFeed = async (req, res) => {
  try {
    const { id } = req.params;
    await Feed.findByIdAndRemove(id);
    return res.status(200).json({ message: 'Product has been deleted sucessfully' });
  } catch (err) {
    return res.status(500).json({ message: err });
  }
};