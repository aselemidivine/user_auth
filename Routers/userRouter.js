const router = require("express").Router();
// const { verifyUserOTP, signUp, requestOTP, login} = require("../controller/userController")
const verificationController = require("../controller/userController")




// Registering the user.
router.post("/signup", verificationController.signUp);

// Verifying the user.
router.post("/verify", verificationController.verifyUserOTP);

// request another otp.
router.post("/request_otp", verificationController.requestOTP);

// login the user.
router.post("/login", verificationController.login);
    

module.exports = router;

