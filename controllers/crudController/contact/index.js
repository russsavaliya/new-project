exports.list = async (Model, req, res) => {
    const page = req.query.page || 1;
    const limit = parseInt(req.query.items) || 10;
    const skip = page * limit - limit;
    try {
        //  Query the database for a list of all results
        const resultsPromise = Model.find({ isDeleted: "false" })
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
        const updateCrypto = await Model.findOneAndUpdate({ _id: req.params.id }, {
            name: req.body.name,
            message: req.body.message,
            email: req.body.email
        }, { returnOriginal: false }).exec()

        return res.status(200).json({
            success: true,
            result: { ...updateCrypto._doc },
            message: 'News Category edited successfully'
        });

    } catch (e) {
        console.log('Error in update contact', e.message)
    }
}

