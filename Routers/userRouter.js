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

// Verifying the user.
router.post("/verify", verificationController.verifyUserOTP);

// request another otp.
router.post("/request_otp", verificationController.requestOTP);

// login the user.
router.post("/login", verificationController.login);
    

module.exports = router;

