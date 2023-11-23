const mongoose = require('mongoose')
const Validator = require('validator')


const validateTravelPlan = (data) => {
    let errors = {};
    if (!data.user_id) {
        errors.user_id = "user_id is required";
    }
    if (!data.tto_country) {
        errors.tto_country = "Country is required";
    }
    if (!data.tto_state) {
        errors.tto_state = "State is required";
    }
    if (!data.dot_from) {
        errors.dot_from = "From Date is required";
    }
    if (!data.dot_to) {
        errors.dot_to = "To Date is required";
    }
    if (!data.activity) {
        errors.activity = "Activity is required";
    }
    if (!data.overview) {
        errors.overview = "Overview is required";
    }

    return {
        errors: errors,
        isValid: Object.keys(errors).length === 0
    };
};

exports.create = async (Model, req, res) => {
    try {

        const { errors, isValid } = validateTravelPlan(req.body);
        if (!isValid) {
            return res.status(400).json({ success: false, errors: errors });
        }

        const count = await Model.countDocuments({
            "user_id": req.user_id,
            "dot_to": { $gte: new Date().toISOString() }
        }).exec()
        if (count > 10) {
            return res.status(400).json({
                success: false,
                message: 'User can have maximum 10 active travel plans.',
            });
        } else {
            const newTravelPlan = new Model({
                user_id: req.body.user_id,
                isDeleted: req.body.isDeleted,
                tto_country: req.body.tto_country,
                tto_state: req.body.tto_state,
                tto_place: req.body.tto_place,
                dot_from: req.body.dot_from,
                dot_to: req.body.dot_to,
                activity: req.body.activity,
                overview: req.body.overview
            });
            const result = await newTravelPlan.save()
            if (result) {
                const user = await mongoose.model('Profiles').findOne({ _id: req.body.user_id }, {
                    _id: 1,
                    firstname: 1,
                    lastname: 1,
                    username: 1,
                    profile_picture_url: 1
                }).exec()
                res.status(200).json({
                    success: true,
                    result: { ...result._doc, user_id: user },
                    message: 'TravelPlan created successfully'
                });
            }
            res.status(400).json({
                success: false,
                message: "TravelPlan is not saved",
            });
        }
    } catch (e) {
        console.log('Error in create travelPlan', e.message)
    }
};


exports.update = async (Model, req, res) => {
    try {

        const { errors, isValid } = validateTravelPlan(req.body);
        if (!isValid) {
            return res.status(400).json({ success: false, errors: errors });
        }
        const updateTravelPlan = await Model.findOneAndUpdate({ _id: req.params.id }, {
            user_id: req.body.user_id,
            isDeleted: req.body.isDeleted,
            tto_country: req.body.tto_country,
            tto_state: req.body.tto_state,
            tto_place: req.body.tto_place,
            dot_from: req.body.dot_from,
            dot_to: req.body.dot_to,
            activity: req.body.activity,
            overview: req.body.overview
        }, { returnOriginal: false }).exec()

        if (updateTravelPlan) {
            const user = await mongoose.model('Profiles').findOne({ _id: req.body.user_id }, {
                _id: 1,
                firstname: 1,
                lastname: 1,
                username: 1,
                profile_picture_url: 1
            }).exec()
            return res.status(200).json({
                success: true,
                result: { ...updateTravelPlan._doc, user_id: user },
                message: 'TravelPlan edited successfully'
            });
        } else {
            return res.status(400).json({
                success: false,
                message: "No TravelPlan found with this id",
            });
        }
    } catch (e) {
        console.log('Error in create travelPlan', e.message)
    }
};
