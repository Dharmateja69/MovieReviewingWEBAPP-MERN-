
const { check, validationResult } = require("express-validator");

exports.UserValidator = [
  check("name").trim().not().isEmpty().withMessage("Name is missing!!"),
  check("email").normalizeEmail().isEmail().withMessage("Email is missing!!"),
  check("password")
    .trim()
    .not()
    .isEmpty()
    .withMessage("password is missing!!")
    .isLength({ min: 8, max: 20 })
    .withMessage("Password must be 8 to 20 characters long !!"),
];
//11-12-2024(7:13)
exports.validatorPassword = [

  check("newPassword")
    .trim()
    .not()
    .isEmpty()
    .withMessage("password is missing!!")
    .isLength({ min: 8, max: 20 })
    .withMessage("Password must be 8 to 20 characters long !!"),
];
//12-12-2024

exports.Siginvalidator = [

  check("email").normalizeEmail().isEmail().withMessage("Email is invalid!!"),
  check("password")
    .trim()
    .not()
    .isEmpty()
    .withMessage("password is missing!!").isLength({ min: 8, max: 20 })
    .withMessage("Password must be 8 to 20 characters long !!"),

];

exports.validate = (req, res, next) => {
  const error = validationResult(req).array();
  if (error.length) {
    return res.json({ error: error[0].msg });
  }
  next();
};