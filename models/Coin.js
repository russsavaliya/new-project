const mongoose = require("mongoose")
const schema = mongoose.Schema

const coinsSchema = new schema({
    id: {
        type: String,
        required: false
    },
    last_price_usd: {
        type: Number,
        required: false
    },
    last_price_btc: {
        type: Number,
        required: false
    },
    circulating_supply: {
        type: Number,
        required: false
    },
    max_supply: {
        type: Number,
        required: false
    },
    total_supply: {
        type: Number,
        required: false
    },
    volume_24_hours: {
        type: Number,
        required: false
    },
    volume_7_days: {
        type: Number,
        required: false
    },
    market_cap: {
        type: Number,
        required: false
    },
    icon: {
        type: String,
        required: false
    },
    rank: {
        type: Number,
        required: false
    },
    title: {
        type: String,
        required: false
    },
    description: {
        type: String,
        required: false
    },
    shortname: {
        type: String,
        required: false
    },
    website: {
        type: String,
        required: false
    },
    whitepaper: {
        type: String,
        required: false
    },
    explorers: {
        type: [String],
        required: false,
        default: []
    },
    communities: {
        type: [String],
        required: false,
        default: [],
        enum: ['facebook', 'twitter', 'reddit']
    },
    tags: {
        type: [String],
        required: false,
        default: []
    },
    chat: {
        type: [String],
        required: false,
        default: []
    },
    contracts: {
        type: [String],
        required: false,
        default: []
    },
    socials: {
        type: [String],
        required: false,
        default: [],
        enum: ['facebook', 'twitter', 'reddit']
    },
    slug: {
        type: String,
        required: false
    }
})

module.exports = mongoose.model("coins", coinsSchema)