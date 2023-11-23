const mongoose = require("mongoose")
const Schema = mongoose.Schema

const cryptoSchema = new Schema({
    isDelete: {
        type: Boolean,
        default: false
    },
    id: {
        type: String,
        require: true
    },
    current_price: {
        type: Number
    },
    market_cap: {
        type: Number
    },
    image: {
        type: String
    },
    market_cap_rank: {
        type: Number
    }
})

module.exports = mongoose.model("Crypto", cryptoSchema)