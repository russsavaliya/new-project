const mongoose = require("mongoose")

const errorSchema = new mongoose.Schema({
    errorStatus: {
        type: String,
        required: false
    },
    errorText: {
        type: String,
        required: false
    },
    errorDateAndTime: {
        type: Date,
        default: new Date()
    },
    errorUrl: {
        type: String,
        required: false
    },
    isDeleted: {
        type: Boolean,
        default: false
    }
}, {
    timestamps: true
})

module.exports = mongoose.model("Error", errorSchema)