import ProductModel from "./model"
import { IProduct } from "./type"

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

  async gets() {
    return await this.productModel.find().populate("categoryId")
  }
}

export default ProductService
