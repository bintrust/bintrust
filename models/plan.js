const mongoose = require("mongoose");
const { ObjectId } = mongoose.Types;

const plansSchema = mongoose.Schema({
  _id: String,
  min: Number,
  max: Number,
  pt: Number,
  tr: Number
});

const Plans = mongoose.model("Plans", plansSchema);

module.exports = Plans;
