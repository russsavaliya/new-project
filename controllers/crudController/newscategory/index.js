const mongoose = require("mongoose")

const validateNewsCategory = (data) => {
    let errors = {}
    if (!data.name) {
        errors.name = "name is required";
    }
    return {
        errors: errors,
        isValid: Object.keys(errors).length === 0
    };

}

exports.create = async (Model, req, res) => {
    try {
        const { errors, isValid } = validateNewsCategory(req.body);
        if (!isValid) {
            return res.status(400).json({ success: false, errors: errors });
        }
        const newCrypto = new Model({
            name: req.body.name
        })
        const result = await newCrypto.save()
        res.status(200).json({
            success: true,
            result: { ...result._doc },
            message: 'NewsCategory created successfully'
        });
    } catch (e) {
        console.log('Error in create newcategory', e.message)
    }
};

exports.list = async (Model, req, res) => {
    const page = req.query.page || 1;
    const limit = parseInt(req.query.items) || 10;
    const skip = page * limit - limit;
    try {
        //  Query the database for a list of all results
        const resultsPromise = Model.find({ isDeleted: "false", status: "true" })
            .skip(skip)
            .limit(limit)


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

exports.update = async (Model, req, res) => {
    try {
        const { errors, isValid } = validateNewsCategory(req.body);
        if (!isValid) {
            return res.status(400).json({ success: false, errors: errors });
        }
        const updateCrypto = await Model.findOneAndUpdate({ _id: req.params.id }, {
            name: req.body.name
        }, { returnOriginal: false }).exec()

        return res.status(200).json({
            success: true,
            result: { ...updateCrypto._doc },
            message: 'News Category edited successfully'
        });

    } catch (e) {
        console.log('Error in create travelPlan', e.message)
    }
}

exports.banNews = async (NewsCategory, req, res) => {
    try {
        const status = !req.body.ban
        const result = await NewsCategory.findOneAndUpdate({ _id: req.params.id }, { status: status }, { returnOriginal: false }).exec()
        if (result) {
            return res.status(200).json({
                success: true,
                result,
            })
        } else {
            return res.status(400).json({
                success: false,
                result: null,
                message: `News is already ${status ? 'Unbaned' : 'Banned'}`
            })
        }
    } catch (err) {
        console.log('Error in ban news ', err.message)
    }
};