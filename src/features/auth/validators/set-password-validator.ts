import { body } from "express-validator"

const setPasswordValidator = [
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

export default setPasswordValidator
