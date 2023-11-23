const mongoose = require('mongoose');
const Article = new mongoose.Schema({
    user_id: {
        type: mongoose.Types.ObjectId,
        ref: "Profiles",
        required: true
    },
    isDeleted: {
        type: Boolean,
        default: false
    },
    article: [{
        title: {
            type: String,
            required: false
        },
        paragraph: {
            type: String,
            required: false
        },
        tags: {
            type: String,
            required: false
        },
        media_url: {
            type: String,
            required: false
        },
        media_type: {
            type: String,
            required: false
        },
        video_url: {
            type: String,
            required: false
        },
        embed_code: {
            type: String,
            required: false
        },
        media_credit: {
            type: String,
            required: false,
        },
    }],
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
    comments: [{
        user: {
            type: mongoose.Types.ObjectId,
            ref: "Profiles",
            required: true
        },
        text: {
            type: String,
            required: true
        },
        createdAt: {
            type: Date,
            default: Date.now
        }
    }],
    users_liked: {
        type: Array,
        required: true,
        default: []
    },
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
    verified: {
        type: Boolean,
        required: true,
        default: false
    },
    modifiedAt: {
        type: Date,
        default: Date.now
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});
module.exports = mongoose.model('Article', Article);