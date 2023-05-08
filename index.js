require('dotenv').config();
const https = require("https")
const fs = require("fs")
const express = require('express')
// const key = fs.readFileSync("certifications/key.pem")
// const cert = fs.readFileSync("certifications/cert.pem")
const app = express()
const {test} = require("./controllers/chatbotControllers")

app.use(express.json())

// 


app.use("/", require("./routes/webhook-route"))

app.get('/', (req, res) => {
    res.send("this is the main page")
})

const port = process.env.PORT || 3000
app.listen(port, console.log(`server is listening on port: ${port}`))

