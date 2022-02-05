const Review = require("../models/Review");

const getAllReviews = (req, res) => {
  res.send("get all reviews");
};
const getSingleReview = (req, res) => {
  res.send("get single review");
};
const createReview = (req, res) => {
  res.send("create review");
};
const editReview = (req, res) => {
  res.send("edit review");
};
const deleteReview = (req, res) => {
  res.send("delete review");
};

module.exports = {
  getAllReviews,
  getSingleReview,
  createReview,
  editReview,
  deleteReview,
};
