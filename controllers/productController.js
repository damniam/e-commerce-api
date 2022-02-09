const Product = require("../models/Product");
const { StatusCodes } = require("http-status-codes");
const CustomError = require("../errors");
const path = require("path");

const getAllProducts = async (req, res) => {
  const products = await Product.find({});
  res.status(StatusCodes.OK).json({ products, count: products.length });
};

const createProduct = async (req, res) => {
  req.body.user = req.user.userId;
  console.log(req.user.userId);
  const product = await Product.create(req.body);
  res
    .status(StatusCodes.CREATED)
    .json({ product, msg: "Product created successfully" });
};

const updateProduct = async (req, res) => {
  const product = await Product.findOneAndUpdate(
    { _id: req.params.id },
    req.body,
    {
      new: true,
      runValidation: true,
    }
  );
  if (!product) {
    throw new CustomError.NotFoundError(
      "There is no product with id " + req.params.id
    );
  }
  res
    .status(StatusCodes.OK)
    .json({ product, msg: "Product updated successfully." });
};

const deleteProduct = async (req, res) => {
  const product = await Product.find({ _id: req.params.id });
  if (!product) {
    throw new CustomError.NotFoundError(
      "There is no product with id " + req.params.id
    );
  }
  await product.remove();
  res.status(StatusCodes.OK).json({ msg: "Successfully removed product" });
};

const getSingleProduct = async (req, res) => {
  const { id: productId } = req.params;
  const product = await Product.findOne({ _id: productId });

  if (!product) {
    throw new CustomError.NotFoundError(
      "There is no product with id " + productId
    );
  }

  res.status(StatusCodes.OK).json({ product });
};

const uploadImage = async (req, res) => {
  if (!req.files || Object.keys(req.files).length === 0) {
    throw new CustomError.BadRequestError("No files were uploaded.");
  }
  const productImage = req.files.image;

  if (!productImage.mimetype.startsWith("image")) {
    res.status(StatusCodes.BAD_REQUEST).json({ msg: "Invalid file type." });
  }

  const imagePath = path.join(
    __dirname,
    "../public/uploads/" + `${productImage.name}`
  );
  await productImage.mv(imagePath);
  res.status(StatusCodes.OK).json({ image: `/uploads/${productImage.name}` });
};

module.exports = {
  getSingleProduct,
  getAllProducts,
  uploadImage,
  createProduct,
  deleteProduct,
  updateProduct,
};
