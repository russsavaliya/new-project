const express = require("express");

const router = express.Router();

const { catchErrors } = require("../handlers/errorHandlers");
const {
  isValidToken,
  login,
  logout,

} = require("../controllers/authController");
const { news, getSingleNews } = require("../controllers/authController")
//const { loginDemo } = require("../controllers/authControllerDemo");

router.route("/login").post(catchErrors(login));
router.route("/logout").post(isValidToken, catchErrors(logout));

router.route("/user/news").get(news)
router.route("/user/news/:slug").get(getSingleNews)

module.exports = router;
