const express = require('express')
const app = express()
const port = 3001
const DB = require('./DB/Db')
const Login = require('./Route/UserLogin')
const forget = require('./Route/forget_password')
const Profile = require('./Route/Profile')
const KYCForm = require('./Route/KycForm')
const TwofactorVerification = require('./Route/TwofactorVerification')
var bodyParser = require('body-parser')
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json())

app.get('/', (req, res) => {
    res.send('Hello World!')
})

app.use('/api', Login)
app.use('/api', forget)
app.use('/api', Profile)
app.use('/api', KYCForm)
app.use('/api', TwofactorVerification)




app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
    DB
})