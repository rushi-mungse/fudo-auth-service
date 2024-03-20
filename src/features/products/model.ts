import { IAttribute, IPriceConfiguration, IProductModel } from "./type"
import mongoose, { Model } from "mongoose"

const attributeValueSchema = new mongoose.Schema<IAttribute>({
  name: {
    type: String,
  },

  value: {
    type: mongoose.Schema.Types.Mixed,
  },
})

const priceConfigurationSchema = new mongoose.Schema<IPriceConfiguration>({
  priceType: {
    type: String,
    enum: ["base", "aditional"],
  },

  availableOptions: {
    type: Map,
    of: Number,
  },
})

const productSchema = new mongoose.Schema<IProductModel>(
  {
    name: {
      type: String,
      required: true,
    },

    description: {
      type: String,
      required: true,
    },

    image: {
      type: String,
      required: true,
    },

    priceConfiguration: {
      type: Map,
      of: priceConfigurationSchema,
    },

    attributes: [attributeValueSchema],

    discount: {
      type: Number,
      default: 0,
      require: false,
    },

    preparationTime: {
      type: Number,
      require: true,
    },

    categoryId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
    },

    isPublish: {
      type: Boolean,
      required: false,
      default: false,
    },
  },
  { timestamps: true },
)

const ProductModel: Model<IProductModel> = mongoose.model(
  "Product",
  productSchema,
)
export default ProductModel
