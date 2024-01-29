
const Transaction = require("../models/transaction")
const User = require("../models/user")

module.exports = {
    createTransaction: async (req, res, type="deposit") => {
        const parsedBody = req.body;
        switch (parsedBody.payment_mode) {
            case "Ethereum":
                parsedBody.walletaddress = parsedBody.ethereum
                break
            case "Bitcoin": 
                parsedBody.walletaddress = parsedBody.bitcoin
                break
            default:
                parsedBody.walletaddress = parsedBody.walletaddress
                break
        }
        parsedBody.status = "pending";
        parsedBody.type = type;
        parsedBody.date = new Date();

        delete parsedBody.bitcoin;
        delete parsedBody.ethereum;
        const newTransaction = new Transaction({...parsedBody});
        const savedTrx = await newTransaction.save();

        // find user that creates the transaction 
        const user = await User.findById(parsedBody.user);
        // push the new trx into the user trx array
        user.transactions.push(savedTrx)
        await user.save();
    }
}