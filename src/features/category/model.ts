import mongoose, { Model, model } from "mongoose"
import { IAttribute, ICategoryModal, IPriceConfiguration } from "./type"

const priceConfigurationSchema = new mongoose.Schema<IPriceConfiguration>({
  priceType: {
    type: String,
    enum: ["base", "aditional"],
    required: true,
  },
  availableOptions: {
    type: [String],
    required: true,
  },
})

const attributeSchema = new mongoose.Schema<IAttribute>({
  name: {
    type: String,
    required: true,
  },
  widgetType: {
    type: String,
    enum: ["switch", "radio"],
    required: true,
  },
  defaultValue: {
    type: mongoose.Schema.Types.Mixed,
    required: true,
  },
  availableOptions: {
    type: [String],
    required: true,
  },
})

const categoryShcema = new mongoose.Schema<ICategoryModal>(
  {
    name: { type: String, require: true, unique: true },
    priceConfiguration: {
      type: Map,
      of: priceConfigurationSchema,
      required: true,
    },
    attribute: { type: [attributeSchema], required: true },
  },
  {
    timestamps: true,
  },
)

const CategoryModel: Model<ICategoryModal> = model("Category", categoryShcema)

export default CategoryModel
