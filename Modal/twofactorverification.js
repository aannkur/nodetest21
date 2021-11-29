var mongoose = require('mongoose');


const Verification = mongoose.Schema(
    {
        kycform: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'KycForm'
        },
        MobileNumber: {
            type: Number
        },
        Verification: {
            type: Boolean,
            default: false
        }


    }, { timestamps: true }
)




module.exports = mongoose.model('Verification', Verification);

