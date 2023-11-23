const mongoose = require('mongoose')
const path = require('path')
const fs = require('fs')
const Validator = require('validator')
const { copyFileToGCS } = require('../../../helpers/google-cloud-storage')
const { isValidObjectId } = require('../../../helpers/common-function')
const validateCreatePost = (data) => {
    let errors = {};
    if (!data.title) {
        errors.title = "Title is required";
    } else if (!Validator.isLength(data.title, { min: 2, max: 80 })) {
        errors.title = "Title length should be more than 2 and less than 80";
    }
    if (!data.desc) {
        errors.desc = "Short Description is required";
    } else {
        if (!Validator.isLength(data.desc, { min: 4, max: 150 })) {
            errors.desc = "Description length should be more than 4 and less than 150";
        }
    }

    if (!data.media_type) {
        errors.media_type = "Media type is required";
    }

    if (!data.tags) {
        errors.tags = "Tags are required";
    } else if (data.tags.includes(',')) {
        if (data.tags.split(',').length > 4) {
            errors.tags = "Maximum 5 Tags are allowed";
        }
    }

    return {
        errors: errors,
        isValid: Object.keys(errors).length === 0
    };
};

exports.create = async (Feed, req, res) => {
    try {
        if (!req.body.postdata) {
            return res.status(400).json({ success: false, message: "PostData is required to create Post" });
        }
        let reqData = typeof req.body.postdata === 'string' ? JSON.parse(req.body.postdata) : req.body.postdata;
        if (req.files && req.files.length > 0) {
            reqData['media_url'] = req.files.map(f => f.path);
        }
        const { errors, isValid } = validateCreatePost(reqData);
        const uploadPath = __dirname + '../../../../'
        if (!isValid) {
            if (reqData['media_url'] && reqData['media_url'].length > 0) {
                reqData['media_url'].forEach(function (file_url) {
                    fs.unlinkSync(path.join(uploadPath, file_url));
                });
            }
            return res.status(400).json({ success: false, errors: errors });
        }

        if ((req.files.media || req.files.length) || reqData.embed_code?.trim() || reqData.video_url?.trim()) {
            let newFeedData = {
                isDeleted: reqData.isDeleted || false,
                user_id: reqData.user_id,
                title: reqData.title || '',
                desc: reqData.desc || '',
                media_type: reqData.media_type || '',
                tags: reqData.tags || '',
                embed_code: reqData.embed_code || '',
                video_url: reqData.video_url || ''
            }

            if (typeof req.files != "undefined" && req.files.length > 0) {
                newFeedData['media_url'] = await Promise.all(req.files.map(async (f) => {
                    return await copyFileToGCS(path.join(uploadPath, f.path), {});
                }));
            } else if (req.files.length) {
                newFeedData['media_url'] = await copyFileToGCS(path.join(uploadPath, req.files.path), {});
            }

            req.files.map(async (f) => {
                fs.unlinkSync(path.join(uploadPath, f.path));
            });
            const tags = reqData.tags
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

            const newFeed = new Feed(newFeedData);
            const feed = await newFeed.save()
            if (feed) {
                const user = await mongoose.model('Profiles').findOneAndUpdate({ _id: reqData.user_id }, { $inc: { posts_count: 1 } },
                    { returnOriginal: false, projection: { _id: 1, firstname: 1, lastname: 1, username: 1, profile_picture_url: 1 } }).exec()
                return res.status(200).json({
                    success: true,
                    message: 'Post created successfully',
                    result: { ...feed._doc, user_id: user },
                });
            } else {
                return res.status(400).json({
                    success: false,
                    message: 'Post is not created',
                });
            }
        } else {
            res.status(400).json({
                success: false,
                media: "Please upload an Image Or Video Or Add Embed code Or Video URL"
            });
        }
    } catch (e) {
        console.log('Error in create post', e.message)
    }
};


exports.update = async (Feed, req, res) => {
    try {
        if (!req.body.postdata) {
            return res.status(400).json({ success: false, message: "PostData is required to Edit Post" });
        }
        let reqData = typeof req.body.postdata === 'string' ? JSON.parse(req.body.postdata) : req.body.postdata;
        const { errors, isValid } = validateCreatePost(reqData);
        const uploadPath = __dirname + '../../../../'
        if (!isValid) {
            if (req.files && req.files.length > 0) {
                req.files.map(f => {
                    fs.unlinkSync(path.join(uploadPath, f.path));
                })
            }
            return res.status(400).json({ success: false, errors: errors });
        }

        if ((req.files && req.files.length) || reqData.embed_code?.trim() || reqData.video_url?.trim() || reqData?.media_url.length) {
            if (!reqData?.media_url) reqData.media_url = []
            let newFeedData = { ...reqData, modifiedAt: new Date() }
            let media_url = []
            if (req.files && req.files.length > 0) {
                media_url = await Promise.all(req.files.map(async (f) => {
                    return await copyFileToGCS(path.join(uploadPath, f.path), {});
                }));
            } else if (req.files.length) {
                media_url = await copyFileToGCS(path.join(uploadPath, req.files.path), {});
            }
            if (media_url.length) newFeedData.media_url = [...newFeedData.media_url, ...media_url]

            req.files.map((f) => {
                fs.unlinkSync(path.join(uploadPath, f.path));
            });

            const tags = reqData.tags || ''
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

            const updateFeed = await Feed.findOneAndUpdate({ _id: req.params.id }, { ...newFeedData }, { returnOriginal: false }).exec()

            if (updateFeed) {
                const user = await mongoose.model('Profiles').findOne({ _id: reqData.user_id }, {
                    _id: 1,
                    firstname: 1,
                    lastname: 1,
                    username: 1,
                    profile_picture_url: 1
                }).exec()
                return res.status(200).json({
                    success: true,
                    result: { ...updateFeed._doc, user_id: user },
                    message: 'Post edited successfully'
                });
            } else {
                return res.status(400).json({
                    success: false,
                    message: "No post found with this id",
                    _id: req.params.id
                });
            }
        } else {
            res.status(400).json({
                success: false,
                media: "Please upload an Image Or Video Or Add Embed code Or Video URL"
            });
        }
    } catch (e) {
        console.log('Error in edit post', e.message)
    }
};

exports.delete = async (Feed, req, res) => {
    try {
        const { user_id, isDeleted } = req.query
        if (!req.params.id) {
            return res.status(400).json({ success: false, message: "id is required" })
        }
        if (!user_id) {
            return res.status(400).json({ success: false, message: "user_id is required" })
        }
        if (!isValidObjectId(req.params.id)) {
            return res.status(400).json({
                status: false,
                message: 'Valid id is required'
            })
        }
        if (!isValidObjectId(user_id)) {
            return res.status(400).json({
                status: false,
                message: 'Valid user_id is required'
            })
        }
        const result = await Feed.findOneAndUpdate({
            _id: req.params.id,
            user_id
        }, { isDeleted: isDeleted === 'true' }, { returnOriginal: false }).exec();
        if (result) {
            const user = await mongoose.model('Profiles').findOneAndUpdate({ _id: user_id }, { $inc: { posts_count: isDeleted ? -1 : 1 } },
                {
                    returnOriginal: false,
                    projection: { _id: 1, firstname: 1, lastname: 1, username: 1, profile_picture_url: 1 }
                }).exec()
            return res.status(200).json({
                success: true,
                result: { ...result._doc, user_id: user },
                message: isDeleted ? "Successfully Deleted" : 'Item undelete successfully!!'
            });
        } else {
            return res.status(400).json({
                success: false,
                result: null,
                message: 'Failed to delete post'
            });
        }
    } catch (e) {
        res.status(400).json({
            success: false,
            error: 'Failed to delete post',
            result: null
        });
    }
}