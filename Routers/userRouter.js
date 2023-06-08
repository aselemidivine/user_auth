const express = require("express");
const multer =  require('multer');
const verificationController = require("../controller/userController");
const otpController = require("../controller/otpController");
const productController = require("../controller/productController");
const jwtMiddleware = require("../middleware/jwt");
const  { signUpRequestSerializer }  = require("../serializer/userSerializers");
const filemiddleware = require("../middleware/multer");

const router = express.Router()
const upload = multer({ dest: 'uploads/files' });

// Registering the user.
router.post("/signup", signUpRequestSerializer,  verificationController.signUp);

// Verifying the user.
router.post("/verify", otpController.verifyUserOTP);

// request another otp.
router.post("/request", otpController.requestOTP);

// login the user.
router.post("/login", verificationController.login);

//create a product
router.post("/product", jwtMiddleware.verifyToken, upload.array('file', 3), 
  filemiddleware.fileFilter, productController.createProduct
);

//get all product
router.get("/product", productController.getAllProduct);

//get a specific product
router.get("/product/:id", productController.getOneProduct);

//get all the user product
router.get("/published", jwtMiddleware.verifyToken, productController.getUserProducts);

//update a specific product...only the user can perform this action
router.patch("/product/:id", jwtMiddleware.verifyToken, productController.modifyProduct);

//delete a specific product...only the user can perform this action
router.delete("/product/:id", jwtMiddleware.verifyToken, productController.deleteBook);

module.exports = router;

