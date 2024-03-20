import { ICategory } from "../category/type"

export interface IProduct {
  name: string
  description: string
  availability: string
  imageUrl: string
  preparationTime: number
  discount: number
  categories: ICategory[]
}
