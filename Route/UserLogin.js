const express = require('express')
const Router = express.Router()
const ModalLogin = require('../Modal/UserLogin')
const validationsingup = require('../Validation/UserSingup')
const validationLogin = require('../Validation/validateLogin')
const bcrypt = require('bcrypt')
const mongoose = require('mongoose')
const path = require('path')
var jwt = require('jsonwebtoken');

Router.post('/registration-ico', (req, res) => {

    const { fullName, userName, email, password } = req.body

    const validate = validationsingup({ fullName, userName, email, password })

    if (!validate.isValid) {
        return res.status(400).json({
            message: "validation Errors",
            errors: validate.error,
            status: false,
        });
    } else {
        let hashedPassword = bcrypt.hashSync(req.body.password, 8)
        // console.log(hashedPassword);
        // const token = jwt.sign({ email }, 'secret key')
        ModalLogin.findOne({ email: email }).exec((error, user) => {
            if (error) {
                return res.status(400).json({
                    message: "email varified error",
                    errors: error,
                    status: false,
                })
            } else {
                if (user) {
                    return res.status(200).json({
                        message: "This email already registard ",
                        user: user,
                        status: false,
                    })

                } else {

                    ModalLogin.findOne({ userName: userName }).exec((error, user) => {
                        if (error) {
                            return res.status(400).json({
                                message: "UserName  error",
                                errors: error,
                                status: false,
                            })
                        } else {
                            if (user) {
                                return res.status(200).json({
                                    message: "This Username already registard ",
                                    user: user,
                                    status: false,
                                })

                            } else {
                                const singup = new ModalLogin({
                                    userId: new mongoose.Types.ObjectId(),
                                    userName: userName,
                                    email: email,
                                    fullName: fullName,
                                    password: hashedPassword,
                                    LoginType: 'Normal'

                                })
                                const token = jwt.sign({ email }, 'secret key',
                                    {
                                        expiresIn: "2h",
                                    }
                                );
                                // save user token
                                singup.token = token;
                                singup.save().then((results) => {
                                    res.status(201).json({
                                        message: "New User Add Successfully",
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
                        }
                    })

                }


            }
        })

    }
})


Router.post('/login-ico', (req, res) => {
    // var ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
    // var ip_info = get_ip(req);

    const { email, password } = req.body
    const validate = validationLogin({ email, password })

    if (!validate.isValid) {
        return res.status(422).json({
            message: "validation Errors",
            errors: validate.error,
            status: false,
        });
    } else {
        ModalLogin.findOne({ email: email }).exec((error, user) => {
            if (error) {
                return res.status(422).json({
                    message: "email varifation fail",
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
            bcrypt.compare(password, user.password, (error, match) => {

                const token = jwt.sign({ email }, 'secret key', {
                    expiresIn: "2h",
                })
                if (error) {
                    return res.status(201).json({
                        message: "password does not match",
                        status: false,
                    })

                } else {
                    if (match) {
                        res.status(201).json({
                            message: "Login User sucessfully",
                            status: true,
                            image: user.image,
                            user: user,
                            match: match
                        })
                        // let LoginObj = {
                        //     userId: user.userId,
                        //     Status: 'True',
                        //     date: user.updatedAt,
                        //     ip: ip_info
                        // }
                        // let sendLoginCredentials = LoginHistory.send(LoginObj)


                    } else {
                        res.status(201).json({
                            message: " password does not match",
                            status: false
                        })

                    }
                }
            })

        })

    }
})

module.exports = Router