const express = require('express')
const Router = express.Router()
const Kycform = require('../Modal/KycForm')
const multer = require("multer")

const kycformvalidation = require('../Validation/kycformvalidation')

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './document/')
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + '-' + file.originalname)
    }
})
const upload = multer({ storage: storage })

Router.post('/KYCForm', upload.single("document"), (req, res) => {
    const userid = req.headers['userid']
    if (!userid) {
        return res.status(401).json({
            message: "Id is requried for Authentication",
            status: 400,
        })
    }
    const { tokenAddress, wallet, zipcode, Nationality, DOB, State, city, OptionAddress, address, telegramUser, phoneNumber, lastName, firstName, email } = req.body
    const validate = kycformvalidation({
        zipcode, Nationality, DOB, State, city, address, phoneNumber, lastName, firstName, email
    })
    if (!validate.isValid) {
        res.status(422).json({
            message: validate.error,
            success: false,
        })
    } else {
        const KycForm = new Kycform({
            userProfile: userid,
            firstName: firstName,
            lastName: lastName,
            phoneNumber: phoneNumber,
            email: email,
            telegramUser: telegramUser,
            address: address,
            OptionAddress: OptionAddress,
            city: city,
            State: State,
            DOB: DOB,
            Nationality: Nationality,
            zipcode: zipcode,
            wallet: wallet,
            tokenAddress: tokenAddress,
            document: req.file.path,
            KycForm: true

        })
        KycForm.save().then((results) => {
            res.status(201).json({
                message: "User Kyc Form fill Successfully",
                status: true,
                results: results
            })


        }).catch((err) => {
            res.status(500).json({
                massage: "server error",
                err: err,
                status: false
            })
        })
    }
})

Router.get('/getKYCformDetails', (req, res) => {
    const userid = req.headers['userid']
    if (!userid) {
        return res.status(400).json({
            message: "User Id Required on Header",
            status: 400,
        })
    }
    Kycform.find({ _id: userid }).populate('userProfile').exec((error, results) => {
        if (error) {
            return res.status(400).json({
                message: "execute error",
                error: error,
                status: 400,
            })
        } else {
            return res.status(200).json({
                message: "to get Data",
                results: results,
                status: 200,
            })
        }
    })
})

module.exports = Router

