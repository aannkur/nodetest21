const express = require('express')
const Router = express.Router()
const LoginModal = require('../Modal/UserLogin')
const validatForget = require('../Validation/forgetpassword')
const validatnewpassword = require('../Validation/newpassword')
const bcrypt = require('bcrypt')
const SendEmail = require('../utility/utill')
// const bcrypt = require('bcryptjs')
var crypto = require("crypto");


Router.post('/reset-password-ico', (req, res) => {

    const { email } = req.body
    const validate = validatForget({ email })
    crypto.randomBytes(32, (err, buffer) => {
        if (err) {
            console.log(err)
        }
        const token = buffer.toString("hex")
        if (!validate.isValid) {
            return res.status(400).json({
                message: "validation Errors",
                errors: validate.error,
                status: false,
            });
        } else {
            LoginModal.findOne({ email: email }).exec((error, user) => {
                if (error) {
                    return res.status(422).json({
                        message: "Email Verification failed",
                        errors: error,
                        status: false,
                    })
                }
                if (!user) {
                    {
                        return res.status(201).json({
                            message: "Email is not registered",
                            user: user,
                            status: false,
                        })
                    }

                }
                // const token = jwt.sign({ email: 'email' }, config.secret, { expiresIn: '15min' })
                user.token = token
                user.expireToken = Date.now() + 3600000
                user.save().then((result) => {
                    res.status(201).json({
                        message: "Forget Password Link Send",
                        status: 201,
                        result: result
                    })
                    let emailObj = {
                        token: token,
                        email: email

                    }
                    let sendLoginCredentials = SendEmail.sendMail(emailObj)
                    // transporter.sendMail({
                    //     from: 'no-replay@insta.com',
                    //     to: email,
                    //     subject: 'Forgot Password',
                    //     html: `
                    //     <p>You requested for password reset</p>
                    //     <h5>click in this <a href="${email}/reset/${token}">link</a> to reset password</h5>
                    //     `
                    // })

                }).catch((err) => {
                    res.status(500).json({
                        massage: "server error",
                        err: err,
                        status: 500
                    })
                })

            })
        }
    })
})


Router.post('/newpassword-ico', (req, res) => {
    const { newpassword, token } = req.body

    const validate = validatnewpassword({ newpassword })
    if (!validate.isValid) {
        return res.status(400).json({
            message: "validation Errors",
            errors: validate.error,
            status: false,
        });
    } else {

        LoginModal.findOne({ token: token }).exec((error, user) => {

            if (error) {

                return res.status(422).json({
                    message: "to get Token Error",
                    errors: error,
                    status: false,
                })

            } else if (!user) {
                return res.status(422).json({
                    message: "Token are not found",
                    errors: error,
                    status: false,
                })
            } else {
                let hashedPassword = bcrypt.hashSync(newpassword, 8)
                user.password = hashedPassword
                user.save().then((result) => {
                    res.json(
                        {
                            message: "Password changed",
                            result: result
                        }
                    )
                })
            }
        })
    }

})


module.exports = Router