const { Timestamp } = require("bson")

const validate = (admin) => {
    error = {}

    if (!admin.code) {
        error.code = "Please enter code"
    }
    return {
        error,
        isValid: Object.keys(error).length === 0
    }

}
module.exports = validate