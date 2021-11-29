const { Timestamp } = require("bson")

const validate = (admin) => {
    error = {}
    if (!admin.DOB) {
        error.DOB = "Please select a email"
    }
    if (!admin.Nationality) {
        error.Nationality = "Please select a email"
    }
    if (!admin.MobileNumber) {
        error.MobileNumber = "Please select a email"
    }
    if (!admin.fullName) {
        error.fullName = "Please select a email"
    }

    return {
        error,
        isValid: Object.keys(error).length === 0
    }

}
module.exports = validate