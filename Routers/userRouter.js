const router = require("express").Router();
const { verifyUserOTP, signUp,requestOTP} = require("../controller/userController")

// Registering the user.
// router.post("/signup", userController.signUp);

// // Verifying the user.
// router.post("/verify", userController.verifyUserOTP);

// // login the user.
// router.post("/login", userController.login);


router.route("/signup")
    .post(signUp);

router.route("/verify")
    .post(verifyUserOTP);


router.route("/request_otp")
    .post(requestOTP);

module.exports = router;

