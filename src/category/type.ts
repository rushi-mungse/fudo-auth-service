import { Document } from "mongoose"

export interface ICategory {
  name: string
}

export type ICategoryModal = ICategory & Document
