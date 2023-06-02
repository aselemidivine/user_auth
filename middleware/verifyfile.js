module.exports.fileFilter = (req, res, next) => {
  const imageFile = req.files[0];
  const secongimageFile = req.files[1];
  const thirdimageFile = req.files[2];
  console.log(imageFile)
  // Accept images only
  if (imageFile.length == 0 || secongimageFile.length == 0 || thirdimageFile.length == 0) {
    return res.status(401).json({ message: 'Three images must be provided for this product' });
  }
  return next();
};
