const express = require("express");
const multer =  require('multer');
const feedController = require("../controller/feedController");
const categoryController = require("../controller/categoryController");
const dataController = require("../controller/dataController");
const jwtMiddleware = require("../middleware/jwt");

const router = express.Router();
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads')
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname)
  },
})
const upload = multer({ storage: storage })

// feed route.
router.post("/feed", jwtMiddleware.verifyToken, upload.array('file', 2), feedController.createFeed);

router.get("/feed/:id", feedController.getOneFeed);

router.patch("/feed/:id", feedController.modifyFeed);

router.delete("/feed/:id", jwtMiddleware.verifyToken, feedController.deleteFeed);


// category route.
router.post("/category", jwtMiddleware.verifyToken, upload.single('file'), categoryController.createCategory);

router.get("/category/:id", categoryController.getOneCategory);

router.patch("/category/:id", categoryController.modifyCategory);

router.delete("/category/:id", jwtMiddleware.verifyToken, categoryController.deleteCategory);


// data route.
router.post("/data", jwtMiddleware.verifyToken, upload.single('file'), dataController.createData);

router.get("/data/:id", dataController.getOneData);

router.patch("/data/:id", dataController.modifyData);

router.delete("/data/:id", jwtMiddleware.verifyToken, dataController.deleteData);

module.exports = router;
