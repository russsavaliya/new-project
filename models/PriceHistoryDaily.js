const mongoose = require("mongoose")
const pricehistorydailySchema = new mongoose.Schema({
    name: {
        type: String,
        required: false
    },
    price: {
        type: mongoose.Schema.Types.Decimal128,
        required: false,
        default: 547844743.39271943259
    },
    date: {
        type: Date,
        required: false
    }
})

module.exports = mongoose.model("price_history_daily", pricehistorydailySchema)