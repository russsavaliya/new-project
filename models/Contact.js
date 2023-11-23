const mongoose = require("mongoose")
const contactSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "name is required"]
    },
    email: {
        type: String,
        required: [true, "email is required"]
    },
    message: {
        type: String,
        required: [true, "message is required"]
    },
    isDeleted: {
        type: Boolean,
        default: false
    },
}, {
    timestamps: true
})

module.exports = mongoose.model("Contact", contactSchema)