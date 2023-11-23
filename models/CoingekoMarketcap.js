const mongoose = require("mongoose")

const marketcapSchema = new mongoose.Schema({
    id: {
        type: String,
        required: true,
        maxlength: 60
    },
    symbol: {
        type: String,
        required: true,
        maxlength: 60,
    },
    name: {
        type: String,
        required: true
    },
    image: {
        type: String,
        required: true,
        maxlength: 300
    },
    current_price: {
        type: Number,
        maxlength: 170
    },
    market_cap: {
        type: Number,
        maxlength: 160
    },
    market_cap_rank: {
        type: Number,
        maxlength: 30
    },
    fully_diluted_valuation: {
        type: Number,
        maxlength: 120
    },
    total_volume: {
        type: Number
    },
    high_24h: {
        type: Number,
        default: null
    },
    low_24h: {
        type: Number
    },
    price_change_24h: {
        type: Number
    },
    price_change_percentage_24h: {
        type: Number
    },
    market_cap_change_24h: {
        type: Number
    },
    market_cap_change_percentage_24h: {
        type: Number
    },
    circulating_supply: {
        type: Number
    },
    total_supply: {
        type: String
    },
    max_supply: {
        type: String
    },
    ath: {
        type: Number
    },
    ath_change_percentage: {
        type: Number
    },
    ath_date: {
        type: Date
    },
    atl: {
        type: Number
    },
    atl_change_percentage: {
        type: Number
    },
    atl_date: {
        type: Date
    },
    last_updated: {
        type: Date
    }
})

module.exports = mongoose.model("Marketcap", marketcapSchema)