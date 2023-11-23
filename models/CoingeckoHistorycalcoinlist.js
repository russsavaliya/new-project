const mongoose = require("mongoose")

const coingeckoHistoricalCoinListSchema = new mongoose.Schema({
    id: {
        type: String
    },
    name: {
        type: String,
        required: true
    },
    symbol: {
        type: String,
    },
    image: {
        type: String
    },
    start_date: {
        type: Date
    },
    modify_date: {
        type: Date
    },
    api_last_record_date: {
        type: Date
    },
    isDone: {
        type: Boolean
    },
    isError: {
        type: Boolean
    }
}, {
    timestamps: true
})

module.exports = mongoose.model("coingecko_historical_coin_list", coingeckoHistoricalCoinListSchema)