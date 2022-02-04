const Product = require('../models/Product');
const { StatusCodes } = require("http-status-codes");
const CustomError = require("../errors");

const getAllProducts = async (req, res) => {
  const products = await Product.find({});
  res.status(StatusCodes.OK).json({products, count: products.length});
};

const createProduct = async (req, res) => {
  res.send("create product");
};

const updateProduct = async (req, res) => {
  res.send("update product");
};

const deleteProduct = async (req, res) => {
  res.send("delete single product");
};

const getSingleProduct = async (req, res) => {
  res.send("get single products");
};

const uploadImage = async (req, res) => {
  res.send("uploadImage product");
};


module.exports = { getSingleProduct, getAllProducts, uploadImage, createProduct, deleteProduct, updateProduct };
