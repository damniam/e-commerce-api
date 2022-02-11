const Order = require("../models/Order");
const Product = require("../models/Product");
const { StatusCodes } = require("http-status-codes");
const checkPermissions = require("../utils/checkPermissions");
const CustomError = require("../errors");

const createOrder = async (req, res) => {
  const { tax, shippingFee, items } = req.body;

  if (!items || items.length === 0) {
    throw new CustomError.BadRequestError("No cart items provided");
  }
  if (!tax || !shippingFee) {
    throw new CustomError.BadRequestError(
      "Please provide a tax and shipping amount"
    );
  }

  let orderItem = [];
  let subtotal = 0;

  res.send("create order");
};

const getAllOrders = async (req, res) => {
  res.send("get all orders");
};

const getSingleOrder = async (req, res) => {
  res.send("get single order");
};

const getCurrentUserOrder = async (req, res) => {
  res.send("co");
};

const updateOrder = async (req, res) => {
  res.send("update order");
};

module.exports = {
  getAllOrders,
  getSingleOrder,
  getCurrentUserOrder,
  createOrder,
  updateOrder,
};
