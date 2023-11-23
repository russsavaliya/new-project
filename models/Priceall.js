const mongoose = require("mongoose")
mongoose.Promise = global.Promise

const pricehistoryExchangeSchema = new mongoose.Schema({
    name: {
        type: String
    },
    nomicsPrice: {
        type: mongoose.Types.Decimal128
    },
    coinStatsPrice: {
        type: mongoose.Types.Decimal128
    },
    coingeckoPrice: {
        type: mongoose.Types.Decimal128,
        required: false
    },
    coinCapprice: {
        type: mongoose.Types.Decimal128,
        required: false
    },
    rank: {
        type: Number,
        required: false
    },
    totalPrice: {
        type: mongoose.Types.Decimal128,
        required: false
    },
    current_price: {
        type: mongoose.Types.Decimal128,
        required: false
    },
    date: {
        type: Date,
        required: false
    }
}, {
    timestamps: true
});


module.exports = mongoose.model("price_history_exchange_data", pricehistoryExchangeSchema)