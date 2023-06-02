const _ = require("lodash");
const otpGenerator = require("otp-generator");
const jwt = require('jsonwebtoken');
const  {User}  = require("../model/userModel");
const { Otp } = require("../model/otpModel");

// Generates a random 6 digit phone for OTP.
const generateOtp = () => {
    return Math.floor(100000 + Math.random() * 900000);
};

//  This checks if string can be converted to number and returns boolean
const isStringConvertibleToInt =(str) => {
    //  replace plus signs with empty string
    if(!str){
        return false;
    }
    str =  str.replace("+", '');
    
    const num = parseInt(str, 10);
    return !isNaN(num) && num.toString() === str;
}

module.exports.signUp = async (req, res) => {
  const { name, phone, password } = req.body;
  // check if phone number is a valid integer
  if (!isStringConvertibleToInt(phone)) {
    return res.status(400).send({ error: "Please use a valid phone number" });
  }

  // check if phone number exist
  const users = await User.find({ phone })
    if (users.length  !== 0) {
      return res.status(400).send({ error: "Phone number is already registered", users });
    } else {
      // Adding user to DB and sending OTP to email/phone.
      const user =   User.create({ name, phone, password })  
      console.log("creating ") 
        // random otp
        const otp = generateOtp();
        Otp.create({ otp, phone });
        return res.status(201).send({ 
          message: "OTP sent. Valid for only 2 minutes", 
          otp
        });  
    }
};

module.exports.login = async (req, res) => {
  const { phone, password } = req.body;

  if (!isStringConvertibleToInt(phone)) {
    return res.status(400).send({ error: "Please use a valid phone number" });
  }

  // check if phone number exist
  const user = await User.findOne({ phone })
  if (!user) {
    return res.status(400).json({ error: "Phone number is not registered" });
  }
  // compare password
  const isPasswordMatched = await user.comparePassword(password);
  if (!isPasswordMatched) {
    return res.status(400).json({ error: "Invalid Password" });
  }
  // jwt token
  const token = await jwt.sign({ id: user._id, phone }, process.env.JWT_SECRET, {
    expiresIn: '24h',
  });
  // return a success message with user details and token.
  return res.status(200).json({
    message: "Login successful",
    user: {
      id: user._id,
      name: user.name,
      phone: user.phone,
      userToken: token,
      created_at: user.createdAt
    }
  });
};
