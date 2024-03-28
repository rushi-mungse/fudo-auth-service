import { body } from "express-validator"

const editUserValidator = [
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

  body("phoneNumber")
    .exists()
    .withMessage("Phone number should be required.")
    .isLength({ min: 10, max: 10 })
    .withMessage("Phone number should be 10 digits."),

  body("role").exists().withMessage("User role should be required."),
]

export default editUserValidator
