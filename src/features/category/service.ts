import CategoryModel from "./model"
import { ICategory } from "./type"

class CategoryService {
  constructor(private categoryModel: typeof CategoryModel) {}

  async save(category: ICategory) {
    const newCategory = new this.categoryModel(category)
    return await newCategory.save()
  }

  async gets() {
    return await this.categoryModel.find()
  }

  async getById(categoryId: string) {
    return await this.categoryModel.findOne({ _id: categoryId })
  }

  async delete(categoryId: string) {
    await this.categoryModel.deleteOne({ _id: categoryId })
  }

  async getByCategoryName(categoryName: string) {
    return await this.categoryModel.findOne({
      name: categoryName,
    })
  }
}

export default CategoryService
