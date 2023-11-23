const mongoose = require("mongoose")
const newscategorySchema = new mongoose.Schema({
    isDeleted: {
        type: Boolean,
        default: false
    },
    name: {
        type: String
    },
    status: {
        type: Boolean,
        default: true
    }
})

module.exports = mongoose.model("news_category", newscategorySchema)