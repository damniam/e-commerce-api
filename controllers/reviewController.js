const Review = require("../models/Review");
const Product = require("../models/Product");
const { StatusCodes } = require("http-status-codes");
const checkPermissions = require("../utils/checkPermissions");
const CustomError = require("../errors");

const getAllReviews = async (req, res) => {
  const reviews = await Review.find({}).populate({
    path: "product",
    select: "name company price",
  });
  res.status(StatusCodes.OK).json({ reviews });
};

const getSingleReview = async (req, res) => {
  const review = await Review.findOne({ _id: req.params.id });
  if (!review) {
    throw new CustomError.BadRequestError("There is no such review");
  }
  res.status(StatusCodes.OK).json({ review });
};

const createReview = async (req, res) => {
  const { product: productId } = req.body;
  req.body.createdBy = req.user.userId;

  const isValidProduct = await Product.findOne({ _id: productId });
  if (!isValidProduct) {
    throw new CustomError.BadRequestError("Product not found");
  }

  const isAlreadyCreated = await Review.findOne({
    product: productId,
    createdBy: req.user.userId,
  });
  if (isAlreadyCreated) {
    throw new CustomError.BadRequestError("Reviews already exist");
  }

  const review = await Review.create(req.body);
  res.status(StatusCodes.OK).json({ review });
};

const editReview = async (req, res) => {
  const { id: reviewId } = req.params;
  const { rating, title, comment } = req.body;
  const review = await Review.findOne({ _id: reviewId });
  if (!review) {
    throw new CustomError.NotFoundError("Review not found");
  }
  checkPermissions(req.user, review.createdBy);

  (review.rating = rating),
    (review.title = title),
    (review.comment = comment),
    await review.save();
  res.status(StatusCodes.OK).json({ review });
};

const deleteReview = async (req, res) => {
  const { id: reviewId } = req.params;
  const review = await Review.findOne({ _id: reviewId });
  if (!review) {
    throw new CustomError.NotFoundError(
      "There is no review with id " + reviewId
    );
  }

  checkPermissions(req.user, review.createdBy);

  review.remove();
  res.status(StatusCodes.OK).json({ msg: "Review deleted successfully" });
};

const getSingleProductReviews = async (req, res) => {
  const product = await Product.findOne({ _id: req.params.id });

  if (!product) {
    throw new CustomError.NotFoundError(
      "There is no product with id " + req.params.id
    );
  }
  res.status(StatusCodes.OK).json({ product });
};

module.exports = {
  getAllReviews,
  getSingleReview,
  getSingleProductReviews,
  createReview,
  editReview,
  deleteReview,
};
