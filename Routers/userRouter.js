const router = require("express").Router();
// const { verifyUserOTP, signUp, requestOTP, login} = require("../controller/userController")
const verificationController = require("../controller/userController")



// router.route("/signup")
//     .post(signUp);

// router.route("/verify")
//     .post(verifyUserOTP);


// router.route("/request_otp")
//     .post(requestOTP);

// router.route("/login")
//     .post(login);


// Registering the user.
router.post("/signup", verificationController.signUp);

// // Verifying the user.
router.post("/verify", verificationController.verifyUserOTP);

// // Verifying the user.
router.post("/request_otp", verificationController.requestOTP);
    

module.exports = router;

