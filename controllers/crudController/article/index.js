const Validator = require("validator");
const path = require('path')
const fs = require('fs')
const mongoose = require('mongoose')
const { copyFileToGCS } = require('../../../helpers/google-cloud-storage')

const validateCreateArticle = (data) => {
    const errorMessage = {}
    if (!data.article) {
        errorMessage.article = 'Article is required'
    } else if (!data.user_id) {
        errorMessage.user_id = 'user_id is required'
    } else {
        for (let i = 0; i < data.article.length; i++) {
            if (data.article[i]) {
                const article = data.article[i] || {}
                article.title = article.hasOwnProperty('title') ? article.title : "";
                article.paragraph = article.hasOwnProperty('paragraph') ? article.paragraph : "";
                if (i === 0) {
                    if (Validator.isEmpty(article.title)) errorMessage.title = 'Title is required in step 1'
                    if (Validator.isEmpty(article.paragraph)) errorMessage.paragraph = "Paragraph is required in step 1";
                } else if (i < 3) {
                    if (Validator.isEmpty(article.paragraph)) errorMessage.paragraph = "Paragraph is required in step " + (i + 1);
                }
                if (!Validator.isEmpty(article.title) && !Validator.isLength(article.title, { min: 2, max: 80 })) {
                    errorMessage.title = "Title length should be more than 2 and less than 80 in step " + (i + 1);
                }
                if (!Validator.isEmpty(article.paragraph) && !Validator.isLength(article.paragraph, {
                    min: 4,
                    max: 250
                })) {
                    errorMessage.paragraph = "Paragraph length should be more than 4 and less than 250 in step " + (i + 1);
                }
            }
        }
    }
    return {
        errors: errorMessage,
        isValid: Object.keys(errorMessage).length === 0
    };
};

exports.create = async (Article, req, res) => {
    try {
        const uploadPath = __dirname + '../../../../'
        if (!req.body.postdata) {
            return res.status(400).json({ success: false, message: "PostData is required to create article" });
        }
        let reqData = typeof req.body.postdata === 'string' ? JSON.parse(req.body.postdata) : req.body.postdata;
        const { errors, isValid } = validateCreateArticle(reqData);

        // Upload all media in google cloud storage and if error then remove from local and return error
        for (const key in req.files || {}) {
            const index = Number(key.charAt(key.length - 1)) || 0
            let pathName = ''
            if (key === 'media') {
                pathName = req.files.media[0].path
            } else if (key) pathName = req.files['media' + `${index}`][0].path
            if (isValid) reqData.article[index].media_url = await copyFileToGCS(path.join(uploadPath, pathName), {});
            fs.unlinkSync(path.join(uploadPath, pathName));
        }
        if (!isValid) return res.status(400).json({ success: false, errors: errors });

        let tags = ''
        reqData.article.map(data => {
            if (data.tags) tags += ',' + data.tags
        })
        if (tags) {
            const Tags = mongoose.model('Tag')
            const tagList = []
            let promises = tags.split(',').map(async (tag) => {
                if (tag) {
                    const isExist = await Tags.findOne({ tag_name: tag }, { ordered: false })
                    if (!isExist) tagList.push({ tag_name: tag })
                }
            })
            await Promise.all(promises)
            if (tagList) Tags.insertMany(tagList, { ordered: false }).then()
        }
        let newArticleData = {
            user_id: reqData.user_id,
            article: reqData.article,
            verified: reqData.verified || false,
            isDeleted: reqData.isDeleted || false,
        };
        const article = new Article(newArticleData);
        const newArticle = await article.save()
        if (newArticle) {
            const user = await mongoose.model('Profiles').findOne({ _id: reqData.user_id }, { _id: 1, firstname: 1, lastname: 1, username: 1, profile_picture_url: 1 }).exec()
            return res.status(200).json({
                success: true,
                message: 'Article created successfully',
                result: { ...newArticle._doc, user_id: user },
            });
        }
    } catch (e) {
        console.log('Error in Create Article', e.message)
    }
};

exports.update = async (Article, req, res) => {
    try {
        if (!req.params.id) {
            return res.status(400).json({ success: false, message: "id is required" });
        }
        if (!req.body.postdata) {
            return res.status(400).json({ success: false, message: "PostData is required to create article" });
        }
        let reqData = typeof req.body.postdata === 'string' ? JSON.parse(req.body.postdata) : req.body.postdata;
        const { errors, isValid } = validateCreateArticle(reqData);
        const uploadPath = __dirname + '../../../../'

        // Upload all media in google cloud storage and if error then remove from local and return error
        for (const key in req.files || {}) {
            const index = Number(key.charAt(key.length - 1)) || 0
            let pathName = ''
            if (key === 'media') {
                pathName = req.files.media[0].path
            } else if (key) pathName = req.files['media' + `${index}`][0].path
            if (isValid) reqData.article[index].media_url = await copyFileToGCS(path.join(uploadPath, pathName), {});
            fs.unlinkSync(path.join(uploadPath, pathName));
        }
        if (!isValid) return res.status(400).json({ success: false, errors: errors });

        let tags = ''
        reqData.article.map(data => {
            if (data.tags) tags += ',' + data.tags
        })
        if (tags) {
            const Tags = mongoose.model('Tag')
            const tagList = []
            let promises = tags.split(',').map(async (tag) => {
                if (tag) {
                    const isExist = await Tags.findOne({ tag_name: tag }, { ordered: false })
                    if (!isExist) tagList.push({ tag_name: tag })
                }
            })
            await Promise.all(promises)
            if (tagList) Tags.insertMany(tagList, { ordered: false }).then()
        }
        const updateArticle = await Article.findOneAndUpdate({ _id: req.params.id }, {
            article: reqData.article,
            modifiedAt: new Date(),
            isDeleted: reqData.isDeleted || false,
            verified: reqData.verified || false
        }, { returnOriginal: false }).exec()

        if (updateArticle) {
            const user = await mongoose.model('Profiles').findOne({ _id: reqData.user_id }, {
                _id: 1,
                firstname: 1,
                lastname: 1,
                username: 1,
                profile_picture_url: 1
            }).exec()
            return res.status(200).json({
                success: true,
                result: { ...updateArticle._doc, user_id: user },
                message: 'Article edited successfully'
            });
        } else {
            return res.status(400).json({
                success: false,
                message: "No article found with this id",
            });
        }
    } catch (err) {
        console.log('Error in edit article ', err.message)
    }
};
