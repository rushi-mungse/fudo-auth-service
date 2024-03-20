import { body } from "express-validator"
import { PriceType, WidgetType } from "../constants"

const categoryValidator = [
  body("name")
    .exists()
    .withMessage("Category name is required.")
    .isString()
    .withMessage("Category name should be string."),

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
    .withMessage("Available options is required.")
    .isArray()
    .withMessage("Price configuration available option should be an array."),

  body("attribute").exists().withMessage("Category attribute is required."),

  body("attribute.*.name")
    .exists()
    .withMessage("Category attribute name is required."),

  body("attribute.*.widgetType")
    .exists()
    .withMessage("Category attribute widget type is required.")
    .custom((value: "swith" | "radio") => {
      if (!WidgetType.includes(value)) {
        throw new Error(
          `${value} is invalid attribute for widget type field. Possible values are: [${WidgetType.join(
            ", ",
          )}]`,
        )
      }
      return true
    }),

  body("attribute.*.defaultValue")
    .exists()
    .withMessage("Category attribute default value is required."),

  body("attribute.*.availableOptions")
    .exists()
    .withMessage("Category attribute available options is required.")
    .isArray()
    .withMessage("Category attribute available option should be an array."),
]

export default categoryValidator
