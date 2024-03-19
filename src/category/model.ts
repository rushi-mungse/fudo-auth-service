import mongoose, { Model, model } from "mongoose"
import { ICategoryModal } from "./type"

const categoryShcema = new mongoose.Schema<ICategoryModal>(
  {
    name: { type: String, require: true, unique: true },
  },
  {
    timestamps: true,
  },
)

const CategoryModel: Model<ICategoryModal> = model("Category", categoryShcema)

export default CategoryModel
