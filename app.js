require("dotenv").config();
require("express-async-errors");
const express = require("express");

const app = express();
const port = process.env.PORT || 5000;

const notFoundMiddleware = require("./middleware/not-found");
const errorHandlerMiddleware = require("./middleware/error-handler");
const morgan = require("morgan");
const cookieParser = require("cookie-parser");

const cors = require("cors");
const helmet = require("helmet");
const xss = require("xss-clean");
const mongoSanitize = require("express-mongo-sanitize");
const rateLimit = require("express-rate-limit");
const fileUpload = require("express-fileupload");
const connectDB = require("./db/connect");

const authRouter = require("./routes/authRoutes");
const userRouter = require("./routes/userRoutes");
const productRouter = require("./routes/productRoutes");
const reviewRouter = require("./routes/reviewRoutes");
const orderRouter = require("./routes/orderRoutes");

app.set("trust proxy", 1);

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
});

// middlewares
app.use(limiter);
app.use(express.static("./public"));
app.use(morgan("tiny"));
app.use(express.json());
app.use(fileUpload());
app.use(cookieParser(process.env.JWT_SECRET));
app.use(cors());
app.use(helmet());
app.use(xss());
app.use(mongoSanitize());

// routes
app.use("/api/v1/auth", authRouter);
app.use("/api/v1/users", userRouter);
app.use("/api/v1/products", productRouter);
app.use("/api/v1/reviews", reviewRouter);
app.use("/api/v1/orders", orderRouter);

app.use(notFoundMiddleware);
app.use(errorHandlerMiddleware);

const start = async () => {
  try {
    await connectDB(process.env.MONGODB_URL);
    app.listen(port, console.log("Server is listening on port " + port));
  } catch (error) {
    console.log("Error connecting to MongoDB");
  }
};

start();
