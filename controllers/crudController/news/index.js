const mongoose = require("mongoose")
const path = require('path')
const fs = require('fs')
const { copyFileToGCS } = require('../../../helpers/google-cloud-storage')
const Validator = require('validator')

const validateCreateNews = (data, id) => {
    let errors = {};
    if (!data.content) {
        errors.content = "Content is required";
    }

    if (!data.title) {
        errors.title = "Title is required";
    }

    if (!data.author) {
        errors.author = "Author is required";
    }

    if (!data.category_id) {
        errors.category_id = "category id is required";
    }

    if (!data.tags) {
        errors.tags = "Tags are required";
    } else if (data.tags.includes(',')) {
        if (data.tags.split(',').length > 4) {
            errors.tags = "Maximum 5 Tags are allowed";
        }
    }

    if (!data.meta_description) {
        errors.meta_description = "Meta Description is required";
    } else {
        if (!Validator.isLength(data.meta_description, { min: 4 })) {
            errors.meta_description = "meta Description length should be more than 4 and less than 150";
        }
    }
    return {
        errors: errors,
        isValid: Object.keys(errors).length === 0
    };
}

exports.update = async (News, req, res) => {
    try {
        if (!req.params.id) {
            return res.status(400).json({ success: false, message: "id is required" });
        }
        if (!req.body.postdata) {
            return res.status(400).json({ success: false, message: "PostData is required to create news" });
        }
        let reqData = typeof req.body.postdata === 'string' ? JSON.parse(req.body.postdata) : req.body.postdata;
        const { errors, isValid } = validateCreateNews(reqData, req.params.id);
        if (!isValid) {
            if (req.file && req.file.news_picture_url) fs.unlinkSync(path.join(__dirname + '../../../../', req.file.path))
            return res.status(400).json({ success: false, errors: errors, result: null });
        }
        if (req.file) {
            if (process.env.FILEUPLOAD == "local") {
                reqData.news_picture_url = req.file.filename
            } else {
                reqData.news_picture_url = await copyFileToGCS(path.join(__dirname + '../../../../', req.file.path), {});
                fs.unlinkSync(path.join(__dirname + '../../../../', req.file.path))
            }
        } else if (!reqData.news_picture_url) {
            return res.status(400).json({ success: false, message: 'news Picture is required', result: null });
        }
        let str = reqData.news_picture_url;
        const dataimage = str.substring(str.lastIndexOf('/') + 1)

        const tags = reqData.tags || ''

        if (tags) {
            let tagsList = []
            let promise = reqData.tags.split(",").map(async (item) => {
                if (item) {
                    let isExist = await mongoose.model("Tag").findOne({ tag_name: item });
                    if (!isExist) tagsList.push({ tag_name: item })
                }
            })
            await Promise.all(promise)
            if (tagsList) mongoose.model("Tag").insertMany(tagsList, { ordered: false });
        }

        const result = await News.findOneAndUpdate({ _id: req.params.id }, { ...reqData, news_picture_url: dataimage }, { returnOriginal: false }).exec()
        if (result) {
            return res.status(200).json({
                success: true,
                result,
                message: 'News edited successfully!!'
            })
        } else {
            return res.status(200).json({
                success: true,
                result: null,
                message: `Failed to edit News`
            })
        }
    } catch (e) {
        console.log(e, "error");
        console.log('Error in update news', e.message)
    }
};

exports.list = async (Model, req, res) => {
    console.log(req.body, 'gafg');
    const page = req.query.page || 1;
    const limit = parseInt(req.query.items) || 10;
    const skip = page * limit - limit;
    try {
        //  Query the database for a list of all results
        const resultsPromise = Model.find({ isDeleted: false })
            .skip(skip)
            .limit(limit)
            .populate("category_id")


        // Counting the total documents
        const countPromise = Model.countDocuments();
        // Resolving both promises
        const [result, count] = await Promise.all([resultsPromise, countPromise]);
        // Calculating total pages
        const pages = Math.ceil(count / limit);

        // Getting Pagination Object
        const pagination = { page, pages, count };
        if (count > 0) {
            return res.status(200).json({
                success: true,
                result,
                pagination,
                // message: "Successfully found all documents",
            });
        } else {
            return res.status(203).json({
                success: false,
                result: [],
                pagination,
                message: "Collection is Empty",
            });
        }
    } catch (err) {
        return res
            .status(500)
            .json({ success: false, result: [], message: "Oops there is an Error" });
    }
};

exports.create = async (News, req, res) => {
    try {
        if (!req.body.postdata) {
            return res.status(400).json({ success: false, message: "PostData is required to create news" });
        }
        let reqData = typeof req.body.postdata === 'string' ? JSON.parse(req.body.postdata) : req.body.postdata;
        const { errors, isValid } = validateCreateNews(reqData);

        if (req.file) {
            if (process.env.FILEUPLOAD == "local") {
                reqData.news_picture_url = req.file.filename
            } else {
                reqData.news_picture_url = await copyFileToGCS(path.join(__dirname + '../../../../', req.file.path), {});
                fs.unlinkSync(path.join(__dirname + '../../../../', req.file.path))
            }
        } else return res.status(400).json({ success: false, message: 'newPicture is required', result: null });

        let slug = reqData.title.split(" ").join("-").toLowerCase()
        let tagsList = []
        let promise = reqData.tags.split(",").map(async (item) => {
            if (item) {
                let isExist = await mongoose.model("Tag").findOne({ tag_name: item });
                if (!isExist) tagsList.push({ tag_name: item })
            }
        })
        await Promise.all(promise)
        if (tagsList) mongoose.model("Tag").insertMany(tagsList, { ordered: false });
        const newNews = new News({ ...reqData, slug });

        newNews.save().then(result => {
            if (result) {
                return res.status(200).json({
                    success: true,
                    result,
                    message: 'news created successfully!!'
                })
            } else {
                return res.status(200).json({
                    success: true,
                    result: null,
                    message: `Failed to create News`
                })
            }
        })
    } catch (e) {
        console.log('Error in create news', e.message)
    }
};


