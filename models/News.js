const mongoose = require('mongoose');

const newsSchema = new mongoose.Schema({
    category_id: {
        type: mongoose.Types.ObjectId,
        required: false,
        ref: 'news_category'
    },
    isDeleted: {
        type: Boolean,
        default: false
    },
    news_picture_url: {
        type: String,
        get(news_picture_url) {
            if (typeof news_picture_url === "string") {
                if (String(process.env.FILEUPLOAD) === "local") {
                    return String(process.env.IMAGE_URL) + news_picture_url;
                } else {
                    return String(process.env.GOOGLE_URL) + news_picture_url;
                }
            }

        }
    },
    href: {
        type: String,
        required: false
    },
    title: {
        type: String,
        required: false,
    },
    slug: {
        type: String,
        required: false
    },
    content: {
        type: String,
        required: false
    },
    meta_description: {
        type: String,
        required: false
    },
    author: {
        type: String,
        required: false
    },
    likes: {
        type: Number,
        required: false
    },
    tags: {
        type: Array,
        default: []
    },
    status: {
        type: Boolean,
        default: true
    }
}, { timestamps: true, toJSON: { getters: true } });

const News = mongoose.model('news', newsSchema);
module.exports = { News }



