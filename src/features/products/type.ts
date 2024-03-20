import { Document } from "mongoose"
import { ICategoryModal } from "../category/type"

export interface IAttribute {
  name: string
  value: string
}

export interface IPriceConfiguration {
  [key: string]: {
    priceType: "base" | "aditional"
    availableOptions: {
      [key: string]: number
    }
  }
}

export interface IProductBody {
  name: string
  description: string
  image: string
  isPublish: string
  discount: string
  categoryId: string
  preparationTime: string
  attributes: string
  priceConfiguration: string
}
export interface IProduct {
  name: string
  description: string
  image: string
  isPublish: boolean
  discount: number
  categoryId: ICategoryModal["_id"]
  preparationTime: number
  attributes: IAttribute[]
  priceConfiguration: IPriceConfiguration
}

export type IProductModel = IProduct & Document
