import { checkSchema } from "express-validator"

export const queryParamsValidator = checkSchema(
  {
    q: {
      trim: true,
      customSanitizer: {
        options: (value: unknown) => {
          return value ? value : ""
        },
      },
    },

    category: {
      trim: true,
      customSanitizer: {
        options: (value: unknown) => {
          return value ? value : ""
        },
      },
    },

    isPublish: {
      trim: true,
      customSanitizer: {
        options: (value: unknown) => {
          return value ? value : "false"
        },
      },
    },

    currentPage: {
      customSanitizer: {
        options: (value) => {
          const parsedValue = Number(value)
          return isNaN(parsedValue) ? 1 : parsedValue
        },
      },
    },

    perPage: {
      customSanitizer: {
        options: (value) => {
          const parsedValue = Number(value)
          return isNaN(parsedValue) ? 6 : parsedValue
        },
      },
    },
  },
  ["query"],
)
