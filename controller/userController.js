const axios = require("axios");
const _ = require("lodash");
const bcrypt = require('bcrypt');
const otpGenerator = require("otp-generator");
const  {User}  = require("../model/userModel");
const  {signUpRequestSerializer}  = require("../serializer/userSerializers");
const { Otp } = require("../model/otpModel");


// // Generates a random 6 digit phone for OTP.
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
      // const user =   User.create({ name: name, phone_number: phone_number, password: password })  
      const user = await  User.create({ name: name, phone: phone, password: password }) 
      console.log("creating ") 
        // random otp
        const otp = generateOtp();

        Otp.create({ otp: otp, phone:phone });
        // fixme : send otp
        return res.status(201).send({"message": "OTP sent. Valid for only 2 minutes", otp});
     
    }
 
};


// 11111
// module.exports.verifyUserOTP = async (req, res) => {

//   const user = await User.find({
//     phone: req.body.phone,
//   });
  

// const otpHolder = await Otp.find({
//   phone: req.body.phone,
//   otp:req.body.otp
// });



// console.log("otpHolder",otpHolder);

// //  it returns a list if the otpholder is null
// if(!otpHolder) return res.status(400).send({"error":"You are using an expired OTP"});

// if(otpHolder  && user.phone === req.body.phone) { 

//   user.isVerified = true
//    await user.save();

//   const OTPDelete = await Otp.deleteMany({
//     phone: otpHolder.phone
//   });

//   return res.status(200).send({
//     "message": "Succesfully verified user!",
//   })
// } else {
//   return res.status(400).send({"error":"Your OTP was wrong!"})
// }
// }

module.exports.verifyUserOTP = async (req, res) => {
  const user = await User.findOne({
    phone: req.body.phone,
  });
  const otpHolder = await Otp.find({
    phone: req.body.phone,
    otp: req.body.otp
  }).limit(1);
  console.log("otpHolder",otpHolder);

  if (otpHolder.length === 0) {
    return res.status(400).send({"error": "You are using an expired OTP"});
  }

  if (otpHolder.length > 0 && user.length > 0 && user[0].phone === req.body.phone) { 
    user[0].isVerified = true;
    await user[0].save();

    const OTPDelete = await Otp.deleteMany({
      phone: otpHolder[0].phone
    });

    return res.status(200).send({
      "message": "Succesfully verified user!",
    });
  } else {
    return res.status(400).send({"error": "Your OTP was wrong!"});
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

// module.exports.signUp = async (req, res) => {
//     const { name, phone, password, confirm_password } = req.body;

//     // signup validate requests
//    let validate_response = signUpRequestSerializer(req,res);
//     if(validate_response){
//         return validate_response;
//     }
    

//   // console.log("name",name, phone_number, password, confirm_password);
//     if (password !== confirm_password) {
//       // It returns an error if the password does not match
//       return res.status(400).send({
//         error: "Password does not match"
//       });
//     }



  
//     // check if phone number is a valid integer
//     // if (!isStringConvertibleToInt(phone_number)) {
//     //   return res.status(400).send({ error: "Please use a valid phone number" });
//     // }

  
//     // check if phone number exist
//     const user = await User.findOne({ phone: phone })
    
//       // check if phone number exist
//       if (user) {
//         return res.status(400).send({ error: "Phone number is already registered" });
//       } else {
//         // todo: hash password
//         // Adding user to DB and sending OTP to email/phone.
//         // const user =   User.create({ name: name, phone_number: phone_number, password: password })  
//         const user =   User.create({ name: name, phone: phone, password: password })  
//           // random otp
//           const otp = generateOtp();

//           Otp.create({ otp: otp, userId: user._id });
//           // fixme : send otp
//           return res.status(201).send({"message": "OTP sent. Valid for only 2 minutes", otp});
       
//       }
   
//   };



// // module.exports.verifyUserOTP = async(req, res) => {
// //     const {phone_number, otp} = req.body;
    
// //     User.findOne({ phone_number: phone_number })

// //     // check if error exist finding user
// //     if (err) {
// //         return res.status(400).send({ error: err.message });
// //       }

// //     // check if phone number exist
// //     if (user) {
// //         // get the user id
// //         const user_id = user._id;
// //         Otp.findOne({userId:user_id, otp:otp}, (err, otp) => {
// //             // an error occurred
// //             if (err) {
// //                 return res.status(400).send({ error: err.message });
// //              }
// //              if (!otp) {
// //                 return res.status(400).send({"error":"OTP no valid"})
// //              }

// //         })
// //         return res.status(200).send({"message": "Otp valid"})
// //     }
// //     // update the user to verified 
// //     User.findByIdAndUpdate(user_id,{is_verified:true})
// //     }



// // User.findOne({ phone_number: phone_number }, (err, user) => 




// // 2222
// // module.exports.verifyUserOTP = async (req, res) => {
// //   const { phone, otp } = req.body;

// //   User.findOne({ phone: phone })
// //     // check if error exist finding user
// //     // if (err) {
// //     //   return res.status(400).send({ error: err.message });
// //     // }

// //     // check if phone number exist
// //     if (User) {
// //       // get the user id
// //       const user_id = User._id;
// //       Otp.findOne({ userId: user_id, otp: otp })
// //         // an error occurred
// //         // if (otp !== otp) {
// //         //   return res.status(400).send({ error: err.message });
// //         // }
// //         if (!otp) {
// //           return res.status(400).send({ error: "OTP no valid" });
// //         }

// //         // update the user to verified
// //         User.findByIdAndUpdate(user_id, { is_verified: true })
// //           .then(() => {
// //             return res.status(200).send({ message: "OTP valid" });
// //           })
// //           .catch((err) => {
// //             return res.status(400).send({ error: err.message });
// //           });
      
// //     } else {
// //       return res.status(400).send({ error: "User not found" });
// //     }
// //   }




// // 3333
// module.exports.verifyUserOTP = async (req, res) => {
//   const { phone, otp } = req.body;

//   try {
//     const user = await User.findOne({ phone: phone }).exec();
//     // if (!user) {
//     //   return res.status(400).send({ error: "User not found" });
//     // }

//     const user_id = user._id;

//     if (!otp) {
//       return res.status(400).send({ error: "OTP not valid" });
//     }

//     const otpRecord = await Otp.findOne({ userId: user_id }).sort({ createdAt: -1 }).exec();
//     if (!otpRecord || otpRecord.otp !== otp) {
//       return res.status(400).send({ error: "Invalid OTP" });
//     }

//     // update the user to verified
//     await User.findByIdAndUpdate(user_id, { is_verified: true }).exec();
//     return res.status(200).send({ message: "OTP valid" });
//   } catch (err) {
//     return res.status(400).send({ error: err.message });
//   }
// };



// // module.exports.verifyUserOTP = async (req, res) => {
// //   const { phone, otp } = req.body;

// //   try {
// //     const otpDoc = await Otp.findOne({ otp: otp });

// //     if (!otpDoc) {
// //       return res.send("Incorrect OTP");
// //     }

// //     const userDoc = await User.findById(otpDoc.userId);
    
// //     console.log(userDoc)
// //     if (!userDoc) {
// //       return res.send("Incorrect OTP or it has been expired.");
// //     }

// //     // if (phone !== userDoc.phone) {
// //     //   return res.send("Incorrect OTP or it has been expired.");
// //     // }

// //     await User.findByIdAndUpdate(otpDoc.userId, { verified: true });
// //     await Otp.deleteOne({ _id: otpDoc._id });

// //     res.send("has been successfully verified");
// //   } catch (err) {
// //     console.error(err);
// //     res.status(500).send({ error: "Internal server error" });
// //   }
// // };


// function serializeUser(user) {
//     return {
//       id: user.id,
//       name: user.name.toUpperCase(),
//     };
//   }


  

// module.exports.login = async(req, res) => {
//     const {phone_number, password} = req.body;

//     User.findOne({ phone_number: phone_number }) 
        
//         // check if error exist finding user
//         if (err) {
//             return res.status(400).send({ error: err.message });
//         }

//         if (!user){
//             return res.status(400).send({ "error":"User does not exist or incorrect password" });
//         }else{
//             // todo: decryt password decrypt(password)
//             const decrypt_password = user.password;
//             // check if password is correct
//             if(password !== decrypt_password) return res.status(400).send({"error":"User does not exist or incorrect password"});    
//         }
//         return res.status(200).send(serializeUser(user));

//     }






// module.exports.signUp = async (req, res) => {
//  const user = await User.findOne({
//     phone: req.body.phone

//   });

//   if(user) return res.status(400).send(" User already registered");
//   const OTP = otpGenerator.generate(6, {
//     digits: true, alphabets: false, upperCase: false, specialChars: false
//   });

//   const phone = req.body.phone;
//   console.log(OTP);

//   // const salt = await bcrypt.genSalt(10)
//   // otp.otp = await bcrypt.hash(otp.otp, salt)
//   const otp = new Otp({ phone: phone, otp: OTP});
//   const result = await otp.save();
//   return res.status(200).send({"message":"Otp send successfully!","otp":OTP});

// }
