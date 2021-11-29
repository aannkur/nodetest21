var mongoose = require('mongoose');


const UserLogin = mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId
        },
        userName: {
            type: String,
            require: true,


        },
        fullName: {
            type: String,

        },
        email: {
            type: String,
        },
        password: {
            type: String,
            require: true
        },
        image: {
            type: String,
            default: 'https://images.coinbase.com/avatar?h=6167e77e937b6a1ad6721fgMjjtXk0n439ENDSUWEmi1y6LBSIkjKnEfHFTy%0Ak5Mo&s=128'
        },
        DOB: {
            type: Date
        },
        MobileNumber: {
            type: Number
        },
        Nationality: {
            type: String
        },
        token: {
            type: String
        }

    }, { timestamps: true }
)




module.exports = mongoose.model('UserLogin', UserLogin);

