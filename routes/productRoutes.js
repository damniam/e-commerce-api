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

router.route("/").get(getAllProducts).post(authorizePermissions, createProduct);
router
  .route("/:id")
  .get(getSingleProduct)
  .patch(authorizePermissions, updateProduct)
  .delete(authorizePermissions, deleteProduct);
router.route("/uploadImage").post(authorizePermissions, uploadImage);

// router.route("/:id/review").get(getSingleProductReview);

module.exports = router;
