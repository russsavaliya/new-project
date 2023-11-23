const User = require("../models/User");
var bcrypt = require('bcryptjs');
const jwt = require("jsonwebtoken")
const Contact = require("../models/Contact");
const { default: axios } = require("axios");

const userRegister = async (req, res, next) => {
    try {
        const { email, password, confirmpassword } = req.body
        if (!email || !password || !confirmpassword) {
            res.status(422).json({ success: false, result: null, message: "please enter all field" })
        }
        const isExitUser = await User.findOne({ email });
        if (isExitUser) {
            res.status(422).json({ success: false, result: null, message: "email already exist" })
        } else {
            if (password !== confirmpassword) {
                res.status(422).json({ success: false, result: null, message: "Password and confirmpassword Field not match" })
            } else if (password < 5) {
                res.status(422).json({ success: false, result: null, message: "Password must contain at five characters" })
            } else {
                const salt = await bcrypt.genSalt();
                const passwordHash = await bcrypt.hash(password, salt);
                const newUser = await User.create({
                    email: email,
                    password: passwordHash
                })
                res.status(201).json({ success: true, result: newUser, message: "register successfull" })
            }
        }
    } catch (error) {
        res.status(500).json({ success: false, result: null, msg: error })
    }
}

const userLogin = async (req, res, next) => {
    try {
        const { email, password } = req.body
        if (!email || !password) {
            return res.status(422).json({ message: "please enter all field" })
        }
        const checkUser = await User.findOne({ email });
        if (!checkUser) {
            return res.status(422).json({ success: false, message: "Invalid credentials" })
        }
        let isMatch = await bcrypt.compare(password, checkUser.password)
        if (!isMatch) {
            return res.status(422).json({ success: false, message: "Invalid credentials" })
        }
        let token = jwt.sign({ id: checkUser._id }, process.env.JWT_SECRET);
        res.status(200).json({ success: true, result: token, message: "login successfull" })
    } catch (error) {
        res.status(500).json({ success: false, result: null, message: error })
    }
}

const addUserContact = async (req, res, next) => {
    try {
        const response_key = req.body['g-recaptcha-response'];

        const secret_key = process.env.GOOGLE_RECAPTCHA_SECRET_KEY;
        const url = `https://www.google.com/recaptcha/api/siteverify?secret=${secret_key}&response=${response_key}`;
        axios.post(url)
            .then((response) => {
                console.log(response, "response");
            })
            .catch((err) => {
                console.log(err);
            })
        const contact = new Contact(req.body);
        const result = await contact.save();
        return res.status(201).json({ success: true, message: "success message send" })
    } catch (error) {
        return res.status(500).json(error.message)
    }
}

module.exports = { userRegister, userLogin, addUserContact }
