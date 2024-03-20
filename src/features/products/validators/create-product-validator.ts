import { body } from "express-validator"
import { PriceType } from "../../../constants"

const createProductValidator = [
  body("name")
    .exists()
    .withMessage("Product name is required.")
    .isString()
    .withMessage("Product name should be string."),

  body("description")
    .exists()
    .withMessage("Product description is required.")
    .isString()
    .withMessage("Product description should be string."),

  body("priceConfiguration")
    .exists()
    .withMessage("Category price configuration is required."),

  body("priceConfiguration.*.priceType")
    .exists()
    .withMessage("Price type is required.")
    .custom((value: "base" | "aditional") => {
      if (!PriceType.includes(value)) {
        throw new Error(
          `${value} is invalid attribute for priceType field. Possible values are: [${PriceType.join(
            ", ",
          )}]`,
        )
      }
      return true
    }),

  body("priceConfiguration.*.availableOptions")
    .exists()
    .withMessage("Price configuration available options is required.")
    .isArray()
    .withMessage("Price configuration available option should be an array."),

  body("attributes").exists().withMessage("Product attribute is required."),
]

export default createProductValidator
