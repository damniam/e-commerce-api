const express = require("express");
const router = express.Router();
const {
  authenticateUser,
  authorizePermissions,
} = require("../middleware/authentication");
const {
  getAllReviews,
  getSingleReview,
  createReview,
  editReview,
  deleteReview,
} = require("../controllers/reviewController");

router.route("/").get(getAllReviews).post(authenticateUser, createReview);
router
  .route("/:id")
  .get(getSingleReview)
  .patch(authenticateUser, editReview)
  .delete(authenticateUser, deleteReview);

module.exports = router;
