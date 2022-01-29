require("dotenv").config();
require("express-async-errors");
const express = require("express");

const app = express();
const port = process.env.PORT || 5000;

const notFoundMiddleware = require("./middleware/not-found");
const errorHandlerMiddleware = require("./middleware/error-handler");
const morgan = require("morgan");
const connectDB = require("./db/connect");
const authRouter = require("./routes/authRoutes");

// middlewares
app.use(morgan('tiny'));
app.use(express.json());

// routes
app.get("/", (req, res) => {
    res.send('<h1>E-commerce API</h1>')
})

app.use('/api/v1/auth', authRouter);

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
