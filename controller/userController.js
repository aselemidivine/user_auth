const  {signUpRequestSerializer}  = require("../serializer/userSerializers");
const axios = require("axios");
const _ = require("lodash");
const otpGenerator = require("otp-generator");
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
  const { name, phone, password, confirm_password } = req.body;

  // signup validate requests
 let validate_response = signUpRequestSerializer(req,res);
  if(validate_response){
      return validate_response;
  }
  

// console.log("name",name, phone_number, password, confirm_password);
  if (password !== confirm_password) {
    // It returns an error if the password does not match
    return res.status(400).send({
      error: "Password does not match"
    });
  }

  // check if phone number is a valid integer
  if (!isStringConvertibleToInt(phone)) {
    return res.status(400).send({ error: "Please use a valid phone number" });
  }

  // check if phone number exist
  const users = await User.find({ phone: phone })
  console.log("user", users.length);

    // check if phone number exist []
    if (users.length  !== 0) {
      console.log("length")
      return res.status(400).send({ error: "Phone number is already registered" });
    } else {
      // todo: hash password
      // Adding user to DB and sending OTP to email/phone.
      const user =   User.create({ name: name, phone: phone, password: password })  
    //   const user = await  User.create({ name: name, phone: phone, password: password }) 
      console.log("creating ") 
        // random otp
        const otp = generateOtp();

        Otp.create({ otp: otp, phone:phone });
        // fixme : send otp
        return res.status(201).send({"message": "OTP sent. Valid for only 2 minutes", otp});
     
    }
 
};







module.exports.requestOTP = async (req, res) => {

const phone = req.body.phone
    // check if phone number exist
const user = await User.findOne({ phone: phone })

if (user) {
  // random otp
  const otp = generateOtp();

  Otp.create({ otp: otp, userId: user._id });
  // fixme : send otp
  return res.status(201).send({"message": "OTP sent. Valid for only 2 minutes", otp});
}
return res.status(400).send({"error":"An error occured getting the user with the phone number "})
}





module.exports.login = async (req, res) => {
  const { phone, password } = req.body;

  // login validate requests
  // let validate_response = signUpRequestSerializer(req,res);
  // if(validate_response){
  //     return validate_response;
  // }

  // check if phone number is a valid integer
  if (!isStringConvertibleToInt(phone)) {
    return res.status(400).send({ error: "Please use a valid phone number" });
  }

  // check if phone number exist
  const user = await User.findOne({ phone: phone })
  if (!user) {
    return res.status(400).send({ error: "Phone number is not registered" });
  }

  // compare password
  const isPasswordMatched = await user.comparePassword(password);
  if (!isPasswordMatched) {
    return res.status(400).send({ error: "Invalid Password" });
  }

  // return a success message with user details
  return res.status(200).send({
    message: "Login successful",
    user: {
      id: user._id,
      name: user.name,
      phone: user.phone,
      created_at: user.createdAt
    }
  });
};



  


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
    if (existingUser) {
        return res.status(201).send({ message: "Registration successful" });
    }
  
    console.log(existingUser)
    // Create the new user account and delete the OTP record
    // const user = new User({ name, email, phone, password });
    const user =   User.create({ name: name, phone: phone, password: password })  


    

    try {
        await user.save();
        await otpRecord.deleteOne({ phone: otpRecord.phone });

        // return res.status(201).send({ message: "Registration successful" });
    } catch (err) {
        return res.status(400).send({ error: err.message });
    }
  };



