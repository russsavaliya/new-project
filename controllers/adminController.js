const mongoose = require("mongoose");
const Admin = mongoose.model("Admin");

/**
 *  Get all documents of a Model
 *  @param {Object} req.params
 *  @returns {Object} Results with pagination
 */

exports.list = async (req, res) => {
    const page = req.query.page || 1;
    const limit = parseInt(req.query.items) || 10;
    const skip = page * limit - limit;
    try {
        //  Query the database for a list of all results
        const resultsPromise = Admin.find({}).skip(skip).limit(limit).sort({ created: "desc" }).populate('role', 'name title permissions');

        // Counting the total documents
        const countPromise = Admin.countDocuments();
        // Resolving both promises
        const [result, count] = await Promise.all([resultsPromise, countPromise]);
        // Calculating total pages
        const pages = Math.ceil(count / limit);

        // Getting Pagination Object
        const pagination = { page, pages, count };
        if (count > 0) {
            for (let admin of result) {
                admin.password = undefined;
            }
            return res.status(200).json({
                success: true,
                result,
                pagination,
                message: "Successfully found all data",
            });
        } else {
            return res.status(203).json({
                success: false,
                result: [],
                pagination,
                message: "Collection is Empty",
            });
        }
    } catch {
        return res
            .status(500)
            .json({ success: false, result: [], message: "Oops there is an Error" });
    }
};
exports.profile = async (req, res) => {
    try {
        //  Query the database for a list of all results
        if (!req.admin) {
            return res.status(404).json({
                success: false,
                result: null,
                message: "couldn't found  admin Profile ",
            });
        }
        let result = {
            _id: req.admin._id,
            enabled: req.admin.enabled,
            email: req.admin.email,
            name: req.admin.name,
            surname: req.admin.surname,
        };

        return res.status(200).json({
            success: true,
            result,
            message: "Successfully found Profile",
        });
    } catch {
        return res.status(500).json({
            success: false,
            result: null,
            message: "Oops there is an Error",
        });
    }
};

exports.read = async (req, res) => {
    try {
        // Find document by id
        const tmpResult = await Admin.findOne({
            _id: req.params.id,
        }).populate('role', ' name title permissions').exec();
        // If no results found, return document not found
        if (!tmpResult) {
            return res.status(404).json({
                success: false,
                result: null,
                message: "No document found by this id: " + req.params.id,
            });
        } else {
            // Return success resposne
            let result = {
                _id: tmpResult._id,
                enabled: tmpResult.enabled,
                email: tmpResult.email,
                name: tmpResult.name,
                surname: tmpResult.surname,
                role: tmpResult.role
            };

            return res.status(200).json({
                success: true,
                result,
                message: "we found this document by this id: " + req.params.id,
            });
        }
    } catch {
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

exports.create = async (req, res) => {
    try {
        let { email, password } = req.body;
        if (!email || !password)
            return res.status(400).json({
                success: false,
                result: null,
                message: "Email or password fields they don't have been entered.",
            });

        const existingAdmin = await Admin.findOne({ email: email });

        if (existingAdmin) return res.status(400).json({
            success: false,
            result: null,
            message: "An account with this email already exists.",
        });

        if (password.length < 8)
            return res.status(400).json({
                success: false,
                result: null,
                message: "The password needs to be at least 8 characters long.",
            });

        let newAdmin = new Admin();
        req.body.password = newAdmin.generateHash(password);

        let result = await new Admin(req.body).save();

        if (!result) {
            return res.status(403).json({
                success: false,
                result: null,
                message: "document couldn't save correctly",
            });
        }
        result = await result.populate('role', ' name title permissions').execPopulate()
        return res.status(200).send({
            success: true,
            result: {
                _id: result._id,
                enabled: result.enabled,
                email: result.email,
                name: result.name,
                surname: result.surname,
                role: result.role
            },
            message: "Admin document save correctly",
        });
    } catch {
        return res.status(500).json({ success: false, message: "there is error" });
    }
};

/**
 *  Updates a Single document
 *  @param {object, string} (req.body, req.params.id)
 *  @returns {Document} Returns updated document
 */

exports.update = async (req, res) => {
    try {
        let { email, role, name, surname } = req.body;

        if (email) {
            const existingAdmin = await Admin.findOne({ _id: { $ne: req.params.id }, email: email });
            if (existingAdmin) {
                return res.status(400).json({ message: "An account with this email already exists." });
            }
        }

        let updates = { role, email, name, surname };

        // Find document by id and updates with the required fields
        const result = await Admin.findOneAndUpdate(
            { _id: req.params.id },
            { $set: updates },
            {
                new: true, // return the new result instead of the old one
            }
        ).populate('role', 'name title permissions').exec()

        if (!result) {
            return res.status(404).json({
                success: false,
                result: null,
                message: "No result found with given data",
            });
        }
        result.password = undefined
        return res.status(200).json({
            success: true,
            result: result,
            message: "Admin data updated successfully",
        });
    } catch (e) {
        return res.status(500).json({
            success: false,
            result: null,
            message: "Oops there is an Error",
        });
    }
};

exports.updatePassword = async (req, res) => {
    try {
        let { password } = req.body;

        if (!password)
            return res.status(400).json({ msg: "Not all fields have been entered." });

        if (password.length < 8)
            return res.status(400).json({
                msg: "The password needs to be at least 8 characters long.",
            });

        // if (password !== passwordCheck)
        //   return res
        //     .status(400)
        //     .json({ msg: "Enter the same password twice for verification." });
        var newAdmin = new Admin();
        const passwordHash = newAdmin.generateHash(password);
        let updates = {
            password: passwordHash,
        };

        // Find document by id and updates with the required fields
        const result = await Admin.findOneAndUpdate(
            { _id: req.params.id },
            { $set: updates },
            {
                new: true, // return the new result instead of the old one
            }
        ).populate('role', ' name title permissions').exec();
        if (!result) {
            return res.status(404).json({
                success: false,
                result: null,
                message: "No document found by this id: " + req.params.id,
            });
        }
        return res.status(200).json({
            success: true,
            result: {
                _id: result._id,
                enabled: result.enabled,
                email: result.email,
                name: result.name,
                surname: result.surname,
                role: result.role
            },
            message: "we update the password by this id: " + req.params.id,
        });
    } catch {
        // Server Error
        return res.status(500).json({
            success: false,
            result: null,
            message: "Oops there is an Error",
        });
    }
};

exports.delete = async (req, res) => {
    try {
        let updates = {
            removed: true,
        };
        // Find the document by id and delete it
        const result = await Admin.findOneAndDelete({ _id: req.params.id }).exec();
        // If no results found, return document not found
        if (!result) {
            return res.status(404).json({
                success: false,
                result: null,
                message: "No Data found",
                // message: "No document found by this id: " + req.params.id,
            });
        } else {
            return res.status(200).json({
                success: true,
                result,
                message: "Successfully Deleted",
            });
        }
    } catch {
        return res.status(500).json({
            success: false,
            result: null,
            message: "Oops there is an Error",
        });
    }
};

exports.search = async (req, res) => {
    try {
        if (
            req.query.q === undefined ||
            req.query.q === "" ||
            req.query.q === " "
        ) {
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
            fields.$or.push({ [field]: { $regex: new RegExp(req.query.q, "i") } });
        }
        let result = await Admin.find(fields)
            .where("removed", false)
            .sort({ name: "asc" })
            .limit(10);

        if (result.length >= 1) {
            return res.status(200).json({
                success: true,
                result,
                message: "Successfully found all documents",
            });
        } else {
            return res.status(202).json({
                success: false,
                result: [],
                message: "No document found by this request",
            });
        }
    } catch {
        return res.status(500).json({
            success: false,
            result: [],
            message: "Oops there is an Error",
        });
    }
};

exports.uac = async (req, res) => {
    try {
        const permissions = ["feed_c", "feed_r", "feed_u", "feed_d", "profile_c", "profile_u", "profile_r", "profile_d", "article_a",
            "article_c", "article_u", "article_r", "article_d", "travelplan_c", "travelplan_u", "travelplan_r", "travelplan_d"].map(_ => ({ name: _, access: true }))
        let data;
        if (req.admin.isSuperAdmin) data = permissions
        else {
            data = permissions.map(permission => {
                permission.access = req.admin.role && req.admin.role.permissions && req.admin.role.permissions.includes(permission.name)
                return permission
            })
        }
        return res.status(200).json({ success: true, result: data })
    } catch (e) {
        return res.status(500).json({
            success: false,
            result: [],
            message: "Oops there is an Error",
        });
    }
};
