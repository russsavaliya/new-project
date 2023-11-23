const mongoose = require("mongoose")

const cryptohistorySchema = new mongoose.Schema({
    name: {
        type: String
    },
    image: {
        type: String
    },
    Date: {
        type: String
    },
    current_price: {
        type: String
    },
    market_cap: {
        type: String
    }
})

module.exports = mongoose.model("CryptoHistory", cryptohistorySchema)