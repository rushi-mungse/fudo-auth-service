import { body } from "express-validator"

const sendOtpValidator = [
  body("fullName")
    .exists()
    .withMessage("Full Name should be required.")
    .isString()
    .withMessage("Full Name should be string."),

  body("email")
    .exists()
    .withMessage("Email should be required.")
    .isEmail()
    .withMessage("Email should be valid email.")
    .isString()
    .withMessage("Email should be string."),

  body("password")
    .exists()
    .withMessage("Password should be required.")
    .isLength({ min: 8 })
    .withMessage("Password should be atleast 8 characters."),

  body("confirmPassword")
    .exists()
    .withMessage("Confirm Password should be required.")
    .isLength({ min: 8 })
    .withMessage("Confirm Password should be atleast 8 characters."),
]

export default sendOtpValidator
