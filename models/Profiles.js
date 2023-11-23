const mongoose = require('mongoose');
const Profiles = new mongoose.Schema({
    username: {
        type: String,
        required: false,
        maxlength: 50
    },
    firstname: {
        type: String,
        required: false,
        maxlength: 50
    },
    lastname: {
        type: String,
        required: false,
        maxlength: 50
    },
    email: {
        type: String,
        required: true,
        unique: true,
        maxlength: 50
    },
    new_email: {
        type: String,
        required: false,
        maxlength: 50
    },
    password: {
        type: String,
        required: true,
        maxlength: 200
    },
    displayname: {
        type: String,
        required: true,
        maxlength: 50
    },
    profile_picture_url: {
        type: String,
        required: false
    },
    profile_banner_url: {
        type: String,
        required: false
    },
    phone: {
        type: String,
        required: true,
        maxlength: 15
    },
    bio: {
        type: String,
        required: true,
        maxlength: 250
    },
    gender: {
        type: String,
        required: true
    },
    country: {
        type: String,
        required: true
    },
    city: {
        type: String,
        required: true
    },
    dob: {
        type: Date,
        required: true
    },
    interests: {
        type: String,
        required: false,
        maxlength: 200
    },
    facebook_link: {
        type: String,
        required: false,
        maxlength: 100
    },
    blog_link: {
        type: String,
        required: false,
        maxlength: 100
    },
    youtube_link: {
        type: String,
        required: false,
        maxlength: 100
    },
    instagram_link: {
        type: String,
        required: false,
        maxlength: 100
    },
    activity_score: {
        type: Number,
        required: true,
        default: 0
    },
    travel_points: {
        type: Number,
        required: true,
        default: 0
    },
    posts_count: {
        type: Number,
        required: true,
        default: 0
    },
    followers: {
        type: Array,
        required: true,
        default: []
    },
    following: {
        type: Array,
        required: true,
        default: []
    },
    isDeleted: {
        type: Boolean,
        default: false
    },
    status: {
        type: Boolean,
        default: true
    },
    application_status: {
        type: String,
        required: false,
        default: 'step1'
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    isVerified:{
        type:Boolean,
        default:false
    },
});

module.exports = mongoose.model('Profiles', Profiles);