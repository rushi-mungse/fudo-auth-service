import { Document } from "mongoose"

export interface ICategory {
  name: string
  priceConfiguration: IPriceConfiguration
  attribute: [IAttribute]
}

export type ICategoryModal = ICategory & Document

export interface IPriceConfiguration {
  [key: string]: {
    priceType: "base" | "aditional"
    availableOptions: [string]
  }
}

export interface IAttribute {
  name: string
  widgetType: "switch" | "radio"
  defaultValue: string | number
  availableOptions: [string]
}
