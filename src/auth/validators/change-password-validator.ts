import { body } from "express-validator"

const changePasswordValidator = [
  body("newPassword")
    .exists()
    .withMessage("New Password should be required.")
    .isLength({ min: 8 })
    .withMessage("New Password should be atleast 8 characters."),

  body("oldPassword")
    .exists()
    .withMessage("Old Password should be required.")
    .isLength({ min: 8 })
    .withMessage("Old Password should be atleast 8 characters."),
]

export default changePasswordValidator
