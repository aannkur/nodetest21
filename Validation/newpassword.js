const { Timestamp } = require("bson")

const validate = (admin) => {
    error = {}
    if (!admin.newpassword) {
        error.newpassword = "Please select a email"
    }

    return {
        error,
        isValid: Object.keys(error).length === 0
    }

}
module.exports = validate