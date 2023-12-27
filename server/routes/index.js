const express = require("express");
const model = require("../data_model/dataModel");
const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const data = await model.find({});
    res.json({ weatherData: data });
  } catch (error) {
    console.error(error);
  }
});

module.exports = router;
