module.exports.fileFilter = async (req, res, next) => {
  const imageFile = req.files[0];
  const secongimageFile = req.files[1];
  const thirdimageFile = req.files[2];
  // Accept images only
  if ( !imageFile || !secongimageFile || !thirdimageFile ) {
    return res.status(401).json({ message: 'Three images must be provided for this product' });
  }
  return next();
};
