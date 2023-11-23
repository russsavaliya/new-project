const mongoose = require("mongoose")
require('mongoose-double')(mongoose);
const Schema = mongoose.Schema;

var SchemaTypes = mongoose.Schema.Types;
const coingeckohistoricalcoindata = new mongoose.Schema({
    name: {
        type: String
    },
    coinlist_id: {
        type: Schema.Types.ObjectId
    },
    current_price: {
        type: SchemaTypes.Double
    },
    market_cap: {
        type: SchemaTypes.Double
    },
    total_volume: {
        type: SchemaTypes.Double
    },
    date: {
        type: String
    },
    apiresponse: [{
        response: {
            type: Schema.Types.Mixed
        }
    }]
}, {
    timestamps: true
})

module.exports = mongoose.model("coingecko_historical_coin_data", coingeckohistoricalcoindata)