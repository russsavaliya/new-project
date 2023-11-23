const router = require("express").Router();
const { userRegister, userLogin, addUserContact } = require("../controllers/userController")
router.post("/signup", userRegister)
router.post("/login", userLogin)
router.post("/contact", addUserContact)

module.exports = router;