import { body } from "express-validator"

const verifyOtpValidator = [
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

  body("hashOtp")
    .exists()
    .withMessage("Hash Otp should be required.")
    .isString()
    .withMessage("Hash Otp should be string."),

  body("otp")
    .exists()
    .withMessage("Otp should be required.")
    .isLength({ min: 4, max: 4 })
    .withMessage("Otp should be 4 digits."),
]

export default verifyOtpValidator
