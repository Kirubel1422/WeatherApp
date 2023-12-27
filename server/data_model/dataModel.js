const mongoose = require("mongoose");

const DataSchema = new mongoose.Schema({
  cityReq: {
    type: String,
    required: true,
  },
  timeStamp: {
    type: String,
    required: true,
  },
});

const model = mongoose.model("weatherdatas", DataSchema);
module.exports = model;
