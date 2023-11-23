const mongoose = require('mongoose');
const prices = new mongoose.Schema({
    token_id: {
        type: mongoose.Types.ObjectId,
        required: false
    },
    date: {
        type: String,
        required: false
    },
    name: {
        type: String,
        required: false
    },
    price_usd: {
        type: Number,
        required: false
    },
    price_btc: {
        type: Number,
        required: true
    },
    image: {
        type: String,
        required: false
    }
}, { timestamps: true });

module.exports = mongoose.model('price_history', prices);
