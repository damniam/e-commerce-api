const express = require("express");
const router = express.Router();
const {
  authenticateUser,
  authorizePermissions,
} = require("../middleware/authentication");
const {
  getSingleProduct,
  getAllProducts,
  uploadImage,
  createProduct,
  deleteProduct,
  updateProduct,
} = require("../controllers/productController");

const { getSingleProductReviews } = require("../controllers/reviewController");

router.route("/").get(getAllProducts).post([authenticateUser, authorizePermissions], createProduct);
router
  .route("/:id")
  .get(getSingleProduct)
  .patch([authenticateUser, authorizePermissions], updateProduct)
  .delete([authenticateUser, authorizePermissions], deleteProduct);
router
  .route("/uploadImage")
  .post([authenticateUser, authorizePermissions], uploadImage);

router.route("/:id/review").get(getSingleProductReviews);

module.exports = router;
