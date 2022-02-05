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
const fileUpload = require("express-fileupload");

const connectDB = require("./db/connect");
const authRouter = require("./routes/authRoutes");
const userRouter = require("./routes/userRoutes");
const productRouter = require("./routes/productRoutes");
const reviewRouter = require("./routes/reviewRoutes");

// middlewares
app.use(express.static("./public"));
app.use(morgan("tiny"));
app.use(express.json());
app.use(cookieParser(process.env.JWT_SECRET));
app.use(cors());
app.use(fileUpload());

// routes
app.get("/", (req, res) => {
  res.send("<h1>E-commerce API</h1>");
});

app.get("/api/v1", (req, res) => {
  console.log(req.cookies);
  res.send("<h1>E-commerce API</h1>");
});

app.use("/api/v1/auth", authRouter);
app.use("/api/v1/users", userRouter);
app.use("/api/v1/products", productRouter);
app.use("/api/v1/reviews", reviewRouter);

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
