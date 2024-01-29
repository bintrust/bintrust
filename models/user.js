const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema.Types;

const userSchema = mongoose.Schema({
  regform: { type: String },
  fname: { type: String },
  lname: { type: String },
  email: { type: String, required: true, unique: true },
  phone: { type: String },
  password: { type: String },
  country: { type: String },
  address: { type: String, default: "" },
  balance: {
    profit: Number,
    bonus: Number,
    ref_bonus: Number,
    active: Number,
    total: Number
  },
  transactions: [
    {
      type: ObjectId,
      ref: "Transaction"
    }
  ],
  referrals: [
    {
      type: ObjectId,
      ref: "User"
    }
  ],
  withdrawal_info: {
    bank: {
      bank_name: String,
      account_name: String,
      account_number: String,
      routing_number: String
    },
    crypto: {
      btc_address: String,
      eht_address: String
    },
    cash_app: {
      cash_app_tag: String
    }
  },
  reg_date: { type: Date, default: new Date() }
});

const User = mongoose.model("User", userSchema);

module.exports = User;
