const express = require('express')
const router = express.Router()
const {test, getWebhook, postWebhook} = require("../controllers/chatbotControllers")

router.route("/webhook").get(getWebhook).post(postWebhook)

module.exports = router