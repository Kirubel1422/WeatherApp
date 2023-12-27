require("dotenv").config();
const express = require("express");
const cors = require("cors");

const app = express();
const mongoose = require("mongoose");
const connect = async () => {
  try {
    mongoose.connect("mongodb://localhost:27017/weather");
  } catch (error) {
    console.error(error);
  }
};

connect();
const router = require("./routes/route");
app.use(cors());

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

const mainRouter = require("./routes/index");
app.use("/", mainRouter);
app.use("/weather", router);

app.listen(process.env.PORT, () =>
  console.log(`Server is listening on ${process.env.PORT}`)
);
