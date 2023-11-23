const path = require('path')
const fs = require('fs')
const bcrypt = require('bcryptjs');
const { copyFileToGCS } = require('../../../helpers/google-cloud-storage')
const validateCreateProfile = (data, id) => {
    let errors = {};
    if (!data.username) {
        errors.username = "Username is required";
    }
    if (!data.firstname) {
        errors.firstname = "Firstname is required";
    }

    if (!data.lastname) {
        errors.lastname = "Lastname is required";
    }

    if (!data.displayname) {
        errors.displayname = "Displayname is required";
    }
    if (!data.email) {
        errors.email = "Email is required";
    }
    if (!data.password && !id) {
        errors.password = "Password is required";
    }

    return {
        errors: errors,
        isValid: Object.keys(errors).length === 0
    };
}

exports.banUser = async (Profile, req, res) => {
    try {
        const status = !req.body.ban
        const result = await Profile.findOneAndUpdate({ _id: req.params.id }, { status: status }, { returnOriginal: false }).exec()
        if (result) {
            return res.status(200).json({
                success: true,
                result,
            })
        } else {
            return res.status(400).json({
                success: false,
                result: null,
                message: `User is already ${status ? 'Unbaned' : 'Banned'}`
            })
        }
    } catch (err) {
        console.log('Error in ban user ', err.message)
    }
};

exports.create = async (Profile, req, res) => {
    try {
        if (!req.body.postdata) {
            return res.status(400).json({ success: false, message: "PostData is required to create Profile" });
        }
        let reqData = typeof req.body.postdata === 'string' ? JSON.parse(req.body.postdata) : req.body.postdata;
        const { errors, isValid } = validateCreateProfile(reqData);
        if (!isValid) {
            if (req.files && req.files.profilePicture) fs.unlinkSync(path.join(__dirname + '../../../../', req.files.profilePicture[0].path))
            if (req.files && req.files.profileBanner) fs.unlinkSync(path.join(__dirname + '../../../../', req.files.profileBanner[0].path))
            return res.status(400).json({ success: false, errors: errors, result: null });
        }

        if (req.files && req.files.profilePicture) {
            reqData.profile_picture_url = await copyFileToGCS(path.join(__dirname + '../../../../', req.files.profilePicture[0].path), {});
            fs.unlinkSync(path.join(__dirname + '../../../../', req.files.profilePicture[0].path))
        } else return res.status(400).json({ success: false, message: 'profilePicture is required', result: null });

        if (req.files && req.files.profileBanner) {
            reqData.profile_banner_url = await copyFileToGCS(path.join(__dirname + '../../../../', req.files.profileBanner[0].path), {});
            fs.unlinkSync(path.join(__dirname + '../../../../', req.files.profileBanner[0].path))
        }
        const isUserExist = await Profile.findOne({ email: reqData.email }).exec()

        if (isUserExist) return res.status(400).json({
            success: false,
            result: null,
            message: 'Email is already exists'
        })
        bcrypt.genSalt(10, (err, salt) => {
            bcrypt.hash(reqData.password, salt, (err, hash) => {
                if (err) throw err;
                if (reqData.password) reqData.password = hash
                const newUser = new Profile({ ...reqData });
                newUser.save().then(result => {
                    if (result) {
                        return res.status(200).json({
                            success: true,
                            result,
                            message: 'User created successfully!!'
                        })
                    } else {
                        return res.status(200).json({
                            success: true,
                            result: null,
                            message: `Failed to create Profile`
                        })
                    }
                })
            });
        });
    } catch (err) {
        return res.status(200).json({
            success: true,
            result: null,
            message: `Failed to create Profile`,
            err: err.message
        })
    }
};

exports.update = async (Profile, req, res) => {
    try {
        if (!req.body.postdata) {
            return res.status(400).json({ success: false, message: "PostData is required to create Profile" });
        }
        let reqData = typeof req.body.postdata === 'string' ? JSON.parse(req.body.postdata) : req.body.postdata;
        const { errors, isValid } = validateCreateProfile(reqData, req.params.id);
        if (!isValid) {
            if (req.files && req.files.profilePicture) fs.unlinkSync(path.join(__dirname + '../../../../', req.files.profilePicture[0].path))
            if (req.files && req.files.profileBanner) fs.unlinkSync(path.join(__dirname + '../../../../', req.files.profileBanner[0].path))
            return res.status(400).json({ success: false, errors: errors, result: null });
        }

        if (req.files && req.files.profilePicture) {
            reqData.profile_picture_url = await copyFileToGCS(path.join(__dirname + '../../../../', req.files.profilePicture[0].path), {});
            fs.unlinkSync(path.join(__dirname + '../../../../', req.files.profilePicture[0].path))
        } else if (!reqData.profile_picture_url) {
            return res.status(400).json({ success: false, message: 'profilePicture is required', result: null });
        }

        if (req.files && req.files.profileBanner) {
            reqData.profile_banner_url = await copyFileToGCS(path.join(__dirname + '../../../../', req.files.profileBanner[0].path), {});
            fs.unlinkSync(path.join(__dirname + '../../../../', req.files.profileBanner[0].path))
        }
        const result = await Profile.findOneAndUpdate({ _id: req.params.id }, { ...reqData }, { returnOriginal: false }).exec()

        if (result) {
            return res.status(200).json({
                success: true,
                result,
                message: 'User edited successfully!!'
            })
        } else {
            return res.status(200).json({
                success: true,
                result: null,
                message: `Failed to edit Profile`
            })
        }
    } catch (err) {
        console.log('Error in edit profile ', err.message)
    }
};

