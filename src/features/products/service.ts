import mongoose from "mongoose"
import { GetQueryParams } from "../../types"
import ProductModel from "./model"
import { Filters, IProduct } from "./type"

class ProductService {
  constructor(private productModel: typeof ProductModel) {}

  async save(product: IProduct) {
    return (await this.productModel.create(product)).populate("categoryId")
  }

  async getById(productId: string) {
    return await this.productModel
      .findOne({ _id: productId })
      .populate("categoryId")
  }

  async delete(productId: string) {
    return await this.productModel.deleteOne({ _id: productId })
  }

  async gets({ perPage, currentPage, q, isPublish, category }: GetQueryParams) {
    const filters: Filters = {}

    if (isPublish == "true") filters.isPublish = true
    if (category && mongoose.Types.ObjectId.isValid(category))
      filters.categoryId = new mongoose.Types.ObjectId(category)

    const query = new RegExp(q, "i")

    const matchQuary = {
      ...filters,
      name: query,
    }

    const aggregate = this.productModel.aggregate([
      {
        $match: matchQuary,
      },
      {
        $lookup: {
          from: "categories",
          localField: "categoryId",
          foreignField: "_id",
          as: "category",
          pipeline: [
            {
              $project: {
                _id: 1,
                name: 1,
                attribute: 1,
                priceConfiguration: 1,
              },
            },
          ],
        },
      },
      {
        $unwind: "$category",
      },
      {
        $facet: {
          metadata: [{ $count: "totalCount" }],
          data: [{ $skip: (currentPage - 1) * perPage }, { $limit: perPage }],
        },
      },
    ])

    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return await aggregate.exec()
  }
}

export default ProductService
