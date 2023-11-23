const mongoose = require('mongoose');
const Post = new mongoose.Schema({
    user_id: {
        type: mongoose.Types.ObjectId,
        ref: "Profiles",
        required: true
    },
    title: {
        type: String,
        required: true
    },
    desc: {
        type: String,
        required: true
    },
    media_type: {
        type: String,
        required: true
    },
    media_url: {
        type: Array,
        required: false
    },
    tags: {
        type: String,
        required: true
    },
    video_url: {
        type: String,
        required: false
    },
    embed_code: {
        type: String,
        required: false
    },
    views: {
        type: Number,
        required: true,
        default: 0
    },
    likes: {
        type: Number,
        required: true,
        default: 0
    },
    comments: {
        type: Array,
        required: true,
        default: []
    },
    // Example of actual Data in comments
    // [
    //    { username:'salvador dali',comment:'Looks like you are flying', timestamp:'3469898364'},
    //   { username:'luke cage',comment:'I hope parachu te opens on time', timestamp:'98634963' }
    // ]
    users_liked: {
        type: Array,
        required: true,
        default: []
    },
    // Example of actual Data in users_liked
    // [
    //   'wdf89g79sd8','ds0f9h09d70'
    // ]
    reports: [{
        user_id: {
            type: mongoose.Types.ObjectId,
            required: true
        },
        reason: {
            type: String,
            required: true
        },
        reportedAt: {
            type: Date,
            default: Date.now
        }
    }],
    isDeleted: {
        type: Boolean,
        default: false
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    modifiedAt: {
        type: Date,
        default: Date.now
    }
});
module.exports = mongoose.model("Feeds", Post);