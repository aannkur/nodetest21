var mongoose = require('mongoose');


const UserProfiledetails = mongoose.Schema(
    {
        userProfile: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'UserLogin',
        },

        fullName: {
            type: String,

        },
        email: {
            type: String,
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
        }


    }, { timestamps: true }
)




module.exports = mongoose.model('UserProfiledetails', UserProfiledetails);

