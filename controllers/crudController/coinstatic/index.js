const validateCryptodynamic = (data) => {
    let errors = {}
    if (!data.title) {
        errors.title = "title is required";
    }
    if (!data.description) {
        errors.description = "description is required";
    }
    if (!data.shortname) {
        errors.shortname = 'shortname is required'
    }
    if (!data.website) {
        errors.website = 'Website name is required'
    }
    return {
        errors: errors,
        isValid: Object.keys(errors).length === 0
    };

}

exports.create = async (Model, req, res) => {
    try {
        const { errors, isValid } = validateCryptodynamic(req.body);
        if (!isValid) {
            return res.status(400).json({ success: false, errors: errors });
        }
        const newCrypto = new Model(req.body)
        const result = await newCrypto.save()
        res.status(200).json({
            success: true,
            result: { ...result._doc },
            message: 'crypto  created successfully'
        });
    } catch (e) {
        console.log('Error in create ctypto', e.message)
    }
};

exports.list = async (Model, req, res) => {
    const page = req.query.page || 1;
    const limit = parseInt(req.query.items) || 10;
    const skip = page * limit - limit;
    try {
        const resultsPromise = Model.aggregate([
            {
                $addFields:
                {
                    hasValue: { $cond: [{ $eq: ["$rank", null] }, 21, 11] },
                }
            },
        ])
            .sort({ hasValue: 1, rank: 1 })
            .skip(skip)
            .limit(limit);


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

exports.update = async (Tokens, req, res) => {
    try {

        const { errors, isValid } = validateCryptodynamic(req.body);
        if (!isValid) {
            return res.status(400).json({ success: false, errors: errors });
        }

        const result = await Tokens.findOneAndUpdate({ _id: req.params.id }, {
            title: req.body.title,
            description: req.body.description

        }, { returnOriginal: false }).exec()

        if (result) {
            return res.status(200).json({
                success: true,
                result,
                message: 'coin edited successfully!!'
            })
        } else {
            return res.status(200).json({
                success: true,
                result: null,
                message: `Failed to edit Tokens`
            })
        }
    } catch (e) {
        console.log('Error in token update', e.message)
    }
};

