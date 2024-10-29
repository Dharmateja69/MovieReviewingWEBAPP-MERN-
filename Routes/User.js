const express = require("express");
const { createcon, VerifyEmail, resendEmailVerficationToken } = require("../Controller/ConUsers");
const { UserValidator ,validate} = require("../Middelwares/validator");

const Router = express.Router();

Router.post("/create",UserValidator,validate, createcon);
Router.post("/verify-email",VerifyEmail);//19/10
Router.post("/resend-email-verfication-token",resendEmailVerficationToken);
module.exports = Router;
