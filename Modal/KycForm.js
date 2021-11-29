var mongoose = require('mongoose');


const KycForm = mongoose.Schema(
    {
        userProfile: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'UserLogin',
        },

        firstName: {
            type: String,

        },
        lastName: {
            type: String,
        },
        email: {
            type: String,
        },
        phoneNumber: {
            type: String
        },
        telegramUser: {
            type: String
        },
        address: {
            type: String
        },
        OptionAddress: {
            type: String
        },
        city: {
            type: String
        },
        State: {
            type: String
        },
        DOB: {
            type: Date
        },
        Nationality: {
            type: String
        },
        zipcode: {
            type: String
        },
        document: {
            type: String,
            default: ''
        },
        wallet: {
            type: String
        },
        tokenAddress: {
            type: String
        },
        KycForm: {
            type: Boolean,
            default: false
        },
        Verification: {
            type: Boolean,
            default: false
        }


    }, { timestamps: true }
)




module.exports = mongoose.model('KycForm', KycForm);

