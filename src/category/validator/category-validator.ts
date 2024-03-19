import { body } from "express-validator"

const categoryValidator = [
  body("name")
    .exists()
    .withMessage("Category name should be required.")
    .isString()
    .withMessage("Category name should be string."),
]

export default categoryValidator
