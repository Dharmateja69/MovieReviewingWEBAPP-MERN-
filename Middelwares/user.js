//11-12-2024
const { isValidObjectId } = require("mongoose");
const PasswordResetToken = require("../Models/Passwordresttoken")
const { senderror } = require("../utils/helper")

exports.isValidPassResetToken = async (req, res, next) => {
    const { token, userId } = req.body;



    if (!token.trim() || !isValidObjectId(userId))
        return senderror(res, 'Invalid request!')
    const resetToken = await PasswordResetToken.findOne({ owner: userId })
    if (!resetToken) return senderror(res, 'Unauthorized access, invalid request!')

    const matched = await resetToken.compareToken(token)
    if (!matched) return senderror(res, 'Unauthorized access, invalid request!')



    req.resetToken = resetToken;
    next()




}