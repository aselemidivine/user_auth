const router = require("express").Router();
const { verifyUserOTP, signUp, requestOTP, login} = require("../controller/userController")



router.route("/signup")
    .post(signUp);

router.route("/verify")
    .post(verifyUserOTP);


router.route("/request_otp")
    .post(requestOTP);

router.route("/login")
    .post(login);

    

module.exports = router;

