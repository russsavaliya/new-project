const mongoose = require('mongoose')
exports.delete = async (Model, req, res) => {
    try {
        // Find the document by id and delete it
        let assigned = await mongoose.model("Admin").find({ role: req.params.id }, { name: 1, surname: 1 }).allowDiskUse().exec()
        if (assigned.length) {
            // Prevent delete role if this role is assigned to any admin
            const adminNames = assigned.map(admin => `1. ${admin.name} ${admin.surname} `)
            return res.status(400).json({
                success: false,
                result: null,
                message: 'This role is assigned to admin first remove role then delete ' + adminNames,
                data: assigned
            })
        }
        const result = await Model.deleteOne({ _id: req.params.id }).exec();
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
                message: "Successfully Deleted"
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