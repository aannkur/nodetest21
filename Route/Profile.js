const express = require('express')
const Router = express.Router()
const multer = require("multer")
const Profile = require('../Modal/UserLogin')
const validateprofile = require('../Validation/Profilevalidation')
const auth = require('../middle/auth')
const bcrypt = require('bcrypt')

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './uploads/')
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + '-' + file.originalname)
    }
})
const upload = multer({ storage: storage })

Router.put("/updateProfile-ico", upload.single("image"), (req, res) => {
    const userid = req.headers['userid']
    if (!userid) {
        return res.status(401).json({
            message: "Id is requried for Authentication",
            status: 400,
        })
    }
    const { fullName, MobileNumber, Nationality, DOB } = req.body
    const validate = validateprofile({
        fullName, MobileNumber, Nationality, DOB
    })
    if (!validate.isValid) {
        res.status(422).json({
            message: validate.error,
            success: false,
        })
    } else {
        if (!req.file) {
            const data = {
                fullName: fullName,
                MobileNumber: MobileNumber,
                Nationality: Nationality,
                DOB: DOB

            }
            Profile.findOneAndUpdate({ userId: userid }, { $set: data }, { new: true }).then((result) => {
                res.status(200).json({
                    message: "update data successfully ",
                    result: result,
                    status: 200,
                })
            }).catch((err) => {
                res.json({
                    error: err,
                    status: 501,
                })
            })
        } else {
            const data = {

                fullName: fullName,
                MobileNumber: MobileNumber,
                Nationality: Nationality,
                DOB: DOB,
                image: req.file.path
            }
            Profile.findOneAndUpdate({ userId: userid }, { $set: data }, { new: true }).then((result) => {
                res.status(200).json({
                    message: "update data successfully ",
                    result: result,
                    status: 200,
                })
            }).catch((err) => {
                res.json({
                    error: err,
                    status: 501,
                })
            })
        }
    }
})


Router.put("/ChangePassword-ico", (req, res) => {
    const userid = req.headers['userid']
    if (!userid) {
        return res.status(401).json({
            messag: "Id is requried for Authentication",
            status: 400,
        })
    }
    const { oldpassword, newpassword } = req.body

    Profile.findOne({ userId: userid }).exec((error, user) => {
        console.log("userid", userid)
        if (error) {
            return res.status(422).json({
                message: "your are not allowed",
                errors: error,
                status: false,
            })
        } else {
            if (user) {
                bcrypt.compare(oldpassword, user.password, (error, match) => {
                    console.log("oldpassword", oldpassword)
                    console.log("user.password", user.password)
                    if (error || !match) {
                        return res.status(400).json({
                            message: "Your old Password not right",
                            status: false,
                        })

                    } else {
                        if (match) {
                            let hashedPassword = bcrypt.hashSync(newpassword, 8)
                            user.password = hashedPassword
                            user.save().then((results) => {
                                res.status(201).json({
                                    message: "Change Password successfully",
                                    status: 201,
                                    results: results
                                })
                            }).catch((err) => {
                                res.status(500).json({
                                    massage: "server error",
                                    err: err,
                                    status: 500
                                })
                            })
                        }
                    }
                })
            }
        }
    })

})


module.exports = Router