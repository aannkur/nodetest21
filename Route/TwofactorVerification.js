const express = require('express')
const Router = express.Router()
var messagebird = require('messagebird')('XlJLDvo4nZJuuaX4fEFUdtC5L');
const twoFactor = require('../Modal/KycForm')
const twoFactorvalidation = require('../Validation/twofactorVerification')


Router.post("/twoFactorVerfication", (req, res) => {
    const { phoneNumber } = req.body
    const token = Math.floor(100000 + Math.random() * 900000)
    if (!phoneNumber) {
        res.status(422).json({
            message: "Validation Error",
            error: "Phone number is required",
            success: false,
        })
    } else {
        messagebird.verify.create(phoneNumber, {
            template: "Your Verify Code is %token",
            "timeout": 300,
        }, function (err, response) {
            if (err) {
                res.status(400).json({
                    message: "Something went wrong",
                    error: err,
                    success: false,
                })
            } else {
                res.status(200).json({
                    message: "Otp Sended",
                    response: response,
                    success: true,
                })
            }
        })
    }

})


Router.put("/verif-change/:phone/:verifyid", (req, res) => {

    const userid = req.headers['userid']
    if (!userid) {
        return res.status(401).json({
            message: "Id is requried for Authentication",
            status: 400,
        })
    }
    // const phoneNumber = req.headers['phonenumber']
    const { phone, verifyid } = req.params
    const { code } = req.body

    const validation = twoFactorvalidation({ code })

    if (validation.isValid) {
        messagebird.verify.verify(verifyid, code, function (err, response) {
            if (err) {
                res.status(402).json({
                    message: "Verification Failed",
                    success: false,
                    error: err
                })
            } else {
                const data = {
                    Verification: true
                }
                twoFactor.findOneAndUpdate({ userProfile: userid }, { $set: data }, { new: true }).then((result) => {
                    res.status(200).json({
                        message: "Verification successfully ",

                        status: 200,
                    })
                })
                // const Factor = new twoFactor({
                //     kycform: userid,
                //     MobileNumber: phone,
                //     Verification: true
                // })
                // Factor.save().then((results) => {
                //     res.status(200).json({
                //         message: "Varification Done",
                //         success: true,

                //     })
                // })
                // res.status(200).json({
                //     message: "Varification Done",
                //     success: true,

                // })

            }
        })
    } else {
        res.status(422).json({
            message: "Send All the credentials",
            error: validation.error,
            success: false
        })
    }
})
module.exports = Router