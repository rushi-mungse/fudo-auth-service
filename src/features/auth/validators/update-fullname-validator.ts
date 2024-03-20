import { body } from "express-validator"

const updateFullNameValidator = [
  body("fullName")
    .exists()
    .withMessage("Full Name should be required.")
    .isString()
    .withMessage("Full Name should be string."),
]

export default updateFullNameValidator
