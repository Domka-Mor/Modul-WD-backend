const express = require("express");
const app = express();
const bodyParser = require('body-parser');
const morgan = require("morgan");
const mongoose = require("mongoose");
require("dotenv").config();

const taskRoutes = require("./api/routes/tasks");

mongoose.connect(
  "mongodb+srv://dominikamoravicova:"+ process.env.MONGO_ATLAS_PW +"@cluster0.wv1zxtk.mongodb.net/"
).then(() => {
		console.log("pripojeny");
	}).catch(err => {
		console.log(err);
	});

app.use(morgan("dev"));
app.use('/uploads', express.static('uploads'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  if (req.method === "OPTIONS") {
    res.header("Access-Control-Allow-Methods", "PUT, POST, DELETE, GET");
    return res.status(200).json({});
  }
  next();
});

// Routes which should handle requests
app.use("/task", taskRoutes);

app.use((req, res, next) => {
  const error = new Error("Not found");
  error.status = 404;
  next(error);
});

app.use((error, req, res, next) => {
  res.status(error.status || 500);
  res.json({
    error: {
      message: error.message
    }
  });
});

module.exports = app;