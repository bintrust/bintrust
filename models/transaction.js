const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema.Types;

const transactionSchema = mongoose.Schema({
    type: String,
    amount: Number,
    payment_mode: String,
    status: String,
    date: Date,
    walletaddress: String,
    user: {
        type: ObjectId,
        ref: "User"
    }
})

const Transaction = mongoose.model("Transaction", transactionSchema);

module.exports = Transaction;