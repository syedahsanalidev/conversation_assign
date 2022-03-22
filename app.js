const path = require('path');
const express = require("express");
const helmet = require("helmet");
const morgan = require("morgan");
const xss = require("xss-clean");
const cors = require('cors');
const AppError = require("./utils/appError");
const globalErrorHandler = require("./controllers/errorController");
const chatRouter = require("./routes/chatRoutes");
const mongoSanitize = require("express-mongo-sanitize");

const app = express();
app.use(cors());
app.options('*', cors());
if (process.env.NODE_ENV == "development") {
  app.use(morgan("dev"));
}


app.use(express.json());
app.use(express.static(`${__dirname}/public`));
app.use(helmet());
app.use(mongoSanitize());
app.use(xss());

app.get("/", (req, res) => {
  res.status(200).send("Hello from server");
});

app.use("/api/v1/chat", chatRouter);

app.all("*", (req, res, next) => {
  next(new AppError(`Canont find ${req.originalUrl} on this server`, 404));
});

app.use(globalErrorHandler);
module.exports = app;
