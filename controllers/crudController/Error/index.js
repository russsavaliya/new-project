exports.list = async (Model, req, res) => {
    const page = req.query.page || 1;
    const limit = parseInt(req.query.items) || 10;
    const skip = page * limit - limit;
    try {
        //  Query the database for a list of all results
        const resultsPromise = Model.find({ isDeleted: false })
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
                message: isDeleted ? "Successfully Deleted" : 'Error undelete successfully!!'
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
