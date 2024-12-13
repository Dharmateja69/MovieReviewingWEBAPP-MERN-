const express = require("express");
const {
    createcon,
    VerifyEmail,
    resendEmailVerficationToken,
    forgetPassword,
    resetPassword,
    sendResetPasswordTokenStatus,
    signin
} = require("../Controller/ConUsers");
const { UserValidator, validate, validatorPassword, Siginvalidator } = require("../Middelwares/validator");
const { isValidPassResetToken } = require("../Middelwares/user");

const Router = express.Router();

Router.post("/create", UserValidator, validate, createcon);
Router.post("/verify-email", VerifyEmail); // 19/10
Router.post("/resend-email-verfication-token", resendEmailVerficationToken);
// 11-12-2024
Router.post("/forget-password", forgetPassword);
//11-12-2024(6:30)
Router.post("/verify-pass-reset-token", isValidPassResetToken, sendResetPasswordTokenStatus);
//11-12-2024(7:13)
Router.post("/reset-password", validatorPassword, validate, isValidPassResetToken, resetPassword);
//12-12-24
Router.post("/signin", Siginvalidator, validate, signin);
module.exports = Router;
