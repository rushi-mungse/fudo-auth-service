import { body } from "express-validator"

const forgetPasswordValidator = [
  body("email")
    .exists()
    .withMessage("Email should be required.")
    .isEmail()
    .withMessage("Email should be valid email.")
    .isString()
    .withMessage("Email should be string."),
]

export default forgetPasswordValidator
