/**
 *  Retrieves a single document by id.
 *  @param {string} req.params.id
 *  @returns {Document} Single Document
 */
const mongoose = require('mongoose')
exports.read = async (Model, req, res) => {
    try {
        // Find document by id
        const result = await Model.findOne({ _id: req.params.id }).populate('user_id', 'firstname lastname username _id profile_picture_url');;
        // If no results found, return document not found
        if (!result) {
            return res.status(404).json({
                success: false,
                result: null,
                message: "No data found",
            });
        } else {
            // Return success resposne
            return res.status(200).json({
                success: true,
                result,
                message: "We found this document by this id: " + req.params.id,
            });
        }
    } catch (err) {
        // Server Error
        return res.status(500).json({
            success: false,
            result: null,
            message: "Oops there is an Error",
        });
    }
};

/**
 *  Creates a Single document by giving all necessary req.body fields
 *  @param {object} req.body
 *  @returns {string} Message
 */

exports.create = async (Model, req, res) => {
    try {
        // Creating a new document in the collection

        const result = await new Model(req.body).save();
        // Returning successfull response
        return res.status(200).json({
            success: true,
            result,
            message: "Successfully Created the document in Model ",
        });
    } catch (err) {
        // If err is thrown by Mongoose due to required validations
        if (err.name == "ValidationError") {
            return res.status(400).json({
                success: false,
                result: null,
                message: "Required fields are not supplied",
            });
        } else {
            // Server Error
            return res.status(500).json({
                success: false,
                result: null,
                message: "Oops there is an Error",
            });
        }
    }
};

/**
 *  Updates a Single document
 *  @param {object, string} (req.body, req.params.id)
 *  @returns {Document} Returns updated document
 */

exports.update = async (Model, req, res) => {
    try {
        // Find document by id and updates with the required fields
        const result = await Model.findOneAndUpdate(
            { _id: req.params.id },
            req.body,
            {
                new: true, // return the new result instead of the old one
                runValidators: true,
            }
        ).exec();

        return res.status(200).json({
            success: true,
            result,
            message: "we update this document by this id: " + req.params.id,
        });
    } catch (err) {
        // If err is thrown by Mongoose due to required validations
        if (err.name == "ValidationError") {
            return res.status(400).json({
                success: false,
                result: null,
                message: "Required fields are not supplied",
            });
        } else {
            // Server Error
            return res.status(500).json({
                success: false,
                result: null,
                message: "Oops there is an Error",
            });
        }
    }
};

/**
 *  Delete a Single document
 *  @param {string} req.params.id
 *  @returns {string} Message response
 */

exports.delete = async (Model, req, res) => {
    try {
        //Find the document by id and delete it
        const isDeleted = req.query.isDeleted === 'true'
        const result = await Model.findOneAndUpdate({ _id: req.params.id }, {
            isDeleted
        }, { returnOriginal: false }).exec();
        // If no results found, return No data found
        if (!result) {
            return res.status(404).json({
                success: false,
                result: null,
                message: "No data found"
            });
        } else {
            return res.status(200).json({
                success: true,
                result,
                message: isDeleted ? "Successfully Deleted" : 'Item undelete successfully!!'
            });
        }
    } catch (e) {
        return res.status(500).json({
            success: false,
            result: null,
            message: "Oops there is an Error",
        });
    }
};

/**
 *  Get all documents of a Model
 *  @param {Object} req.params
 *  @returns {Object} Results with pagination
 */

exports.list = async (Model, req, res) => {
    const page = req.query.page || 1;
    const limit = parseInt(req.query.items) || 10;
    const skip = page * limit - limit;
    try {
        //  Query the database for a list of all results
        const resultsPromise = Model.find()
            .skip(skip)
            .limit(limit)
            .sort({ createdAt: -1 })
            .populate('user_id', 'firstname lastname username _id profile_picture_url');
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

/**
 *  Searching documents with specific properties
 *  @param {Object} req.query
 *  @returns {Array} List of Documents
 */

exports.search = async (Model, req, res, entity) => {
    if (req.query.q === undefined || req.query.q === "" || req.query.q === " ") {
        return res
            .status(202)
            .json({
                success: false,
                result: [],
                message: "No document found by this request",
            })
            .end();
    }
    const fieldsArray = req.query.fields.split(",");

    const fields = { $or: [] };

    for (const field of fieldsArray) {
        let query = { [field]: { $regex: new RegExp(req.query.q, "i") } }
        if (field === 'title' && entity === 'article') query = { article: { $elemMatch: { title: new RegExp(req.query.q, "i") } } }
        fields.$or.push(query);
    }

    try {

        let projection = {}
        if (entity === 'profile') projection = { username: 1, firstname: 1, lastname: 1, _id: 1, profile_picture_url: 1 }
        else if (entity === 'article') projection = { article: 1, _id: 1 }
        else if (entity === 'travelPlan') projection = { tto_country: 1, tto_state: 1, tto_place: 1, _id: 1 }
        else if (entity === 'post') projection = { title: 1, tags: 1, desc: 1, _id: 1 }
        else if (entity === 'roles') projection = { name: 1, title: 1, _id: 1 }
        else if (entity === 'crypto') projection = { name: 1, current_price: 1, _id: 1 }
        else if (entity === 'cryptohistory') projection = { name: 1, current_price: 1, date: 1, _id: 1 }
        else if (entity === 'newscategory') projection = { name: 1, _id: 1 }
        else if (entity === 'news') projection = { title: 1, author: 1, content: 1, _id: 1 }
        let results = await Model.find(fields, projection).sort({ name: "asc" }).limit(10);
        if (results.length >= 1) {
            return res.status(200).json({
                success: true,
                result: results,
                message: "Successfully found all data",
            });
        } else {
            return res.status(202).json({
                success: false,
                result: [],
                message: "No search found",
            }).end();
        }
    } catch {
        return res.status(500).json({
            success: false,
            result: null,
            message: "Oops there is an Error",
        });
    }
};

exports.getTags = async (req, res, next) => {
    try {
        const Tag = mongoose.model('Tag')
        const arg = {}
        if (req.body.tag) arg["tag_name"] = { $regex: '^' + req.body.tag, $options: 'i' }
        Tag.find(arg, { tag_name: 1, _id: 0 }).limit(10)
            .then(tags => res.status(200).json({ status: true, tag: req.body.tag, tag_list: tags }))
            .catch(e => res.status(400).json({ status: false, message: "Failed to fetch tags" }))

    } catch (e) {
        console.log('Error in get tags', e.message)
    }
}