const _ = require("lodash");
const otpGenerator = require("otp-generator");
const jwt = require('jsonwebtoken');
const  { User }  = require("../model/userModel");
const { Otp } = require("../model/otpModel");

// Generates a random 6 digit phone for OTP.
const generateOtp = () => {
  return Math.floor(100000 + Math.random() * 900000);
};

module.exports.requestOTP = async (req, res) => {
  const phone = req.body.phone;
    // check if phone number exist
  const user = await User.findOne({ phone });
  if (user) {
  // random otp
  const otp = generateOtp();
  Otp.create({ otp, userId: user._id });
  // fixme : send otp
  return res.status(201).json({ message: "OTP sent. Valid for only 2 minutes", otp});
  }
  return res.status(400).json({ error: "An error occured getting the user with the phone number " })
}


module.exports.verifyUserOTP = async (req, res) => {
    const { name, phone, password, otp } = req.body;
    // Check if the OTP is valid
    const otpRecord = await Otp.findOne({ otp });
    if (!otpRecord) {
      return res.status(400).send({ error: "Invalid OTP" });
    }
  
    // Check if the OTP has expired (valid for only 2 minutes)
    const otpCreatedTime = new Date(otpRecord.createdAt);
    const otpExpiryTime = otpCreatedTime.setMinutes(otpCreatedTime.getMinutes() + 2);
    if (Date.now() > otpExpiryTime) {
      return res.status(400).send({ error: "OTP expired. Please request a new one." });
    }
  
    // Check if the phone number is already registered
    const existingUser = await User.findOne({ phone });
    const token = await jwt.sign({ id: existingUser._id, phone }, process.env.JWT_SECRET, {
      expiresIn: '24h',
    });
    // make sure user is verified
    await User.findByIdAndUpdate(existingUser._id,
      { is_verified: true }, { useFindAndModify: false });
    if (existingUser) {
        return res.status(201).send({
          message: "Registration successful",
          userToken: token,
      });
    }
    try {
      await otpRecord.deleteOne({ phone: otpRecord.phone });

        // return res.status(201).send({ message: "Registration successful" });
    } catch (err) {
        return res.status(400).send({ message: err });
    }
};
