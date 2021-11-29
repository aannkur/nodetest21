const express = require('express')
const Router = express.Router()
const AuthUser = require('../Modal/UserLogin')

module.exports.isAuthorized = function (req, res, next) {
    const userid = req.headers['userid']
    if (!userid) {
        return res.status(401).json({
            message: "Id is requried for Authentication",
            status: 400,
        })
    } else {
        AuthUser.findOne({ userId: userid }).exec(function (error, user) {
            if (error) {
                return res.status(400).json({
                    message: "Authentication Error",
                    errors: error,
                    status: false,
                })
            } else {
                if (!user) {
                    return res.status(400).json({
                        message: "User Does not in DB",
                        errors: error,
                        status: false,
                    })
                } else {
                    return next();
                }
            }

        });
    }
}