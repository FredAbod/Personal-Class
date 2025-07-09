const express = require("express");
const { signup, login, verifyUser, resetPassword, forgetPassword } = require("../controller/user.controller");
const router = express.Router()


router.post('/signup', signup)
router.post('/login', login)
router.post('/verify', verifyUser)
router.post('/forget', forgetPassword)
router.post('/reset', resetPassword)


module.exports = router