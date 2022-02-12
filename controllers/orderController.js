const Order = require("../models/Order");
const Product = require("../models/Product");
const { StatusCodes } = require("http-status-codes");
const checkPermissions = require("../utils/checkPermissions");
const CustomError = require("../errors");

const fakeStripeAPI = async ({ amount, currency }) => {
  const client_secret = "secretValue";
  return { client_secret, amount };
};

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

  let orderItems = [];
  let subtotal = 0;

  //   console.log(items);

  for (const item of items) {
    const orderItem = await Product.findOne({ _id: item.product });
    if (!orderItem) {
      throw new CustomError.BadRequestError("Item ID invalid");
    }
    const { name, price, image, _id: productId } = orderItem;
    const singleOrderItem = {
      name,
      price,
      image,
      product: productId,
      amount: item.amount,
    };

    orderItems = [...orderItems, singleOrderItem];
    subtotal += item.amount * price;
  }

  const total = tax + shippingFee + subtotal;

  const paymentIntent = await fakeStripeAPI({
    amount: total,
    currency: "usd",
  });

  const order = await Order.create({
    tax,
    shippingFee,
    subtotal,
    total,
    orderItems,
    user: req.user.userId,
    clientSecret: paymentIntent.client_secret,
  });

  res.status(StatusCodes.CREATED).json({ order });
};

const getAllOrders = async (req, res) => {
  const orders = await Order.find({});
  res.status(StatusCodes.OK).json({ orders, count: orders.length });
};

const getSingleOrder = async (req, res) => {
  const { id: orderId } = req.params;
  const order = await Order.findOne({ _id: orderId });

  if (!order) {
    throw new CustomError.NotFoundError("Order not found");
  }
  checkPermissions(req.user, order.user);
  res.status(StatusCodes.OK).json({ order });
};

const getCurrentUserOrder = async (req, res) => {
  const userOrders = await Order.find({ user: req.user.userId });
  res.status(StatusCodes.OK).json({ userOrders, count: userOrders.length });
};

const updateOrder = async (req, res) => {
  const { id: orderId } = req.params;
  const { paymentIntentId } = req.body;

  const order = await Order.findOne({ _id: orderId });
  if (!order) {
    throw new CustomError.NotFoundError(`No order with id : ${orderId}`);
  }
  checkPermissions(req.user, order.user);

  order.paymentIntentId = paymentIntentId;
  order.status = "paid";
  await order.save();

  res.status(StatusCodes.OK).json({ order });
};

module.exports = {
  getAllOrders,
  getSingleOrder,
  getCurrentUserOrder,
  createOrder,
  updateOrder,
};
