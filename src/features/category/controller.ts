import { NextFunction, Request, Response } from "express"
import { validationResult } from "express-validator"
import createHttpError from "http-errors"

import CategoryService from "./service"
import { AuthRequest } from "../../types"
import { ICategory } from "./type"

class CategoryController {
  constructor(private categoryService: CategoryService) {}

  async create(req: AuthRequest<ICategory>, res: Response, next: NextFunction) {
    const result = validationResult(req)
    if (!result.isEmpty())
      return res.status(400).json({ error: result.array() })

    const categoryData = req.body
    const isCategoryExist = await this.categoryService.getByCategoryName(
      categoryData.name,
    )
    if (isCategoryExist)
      return next(createHttpError(400, "Category name already exist."))

    const category = await this.categoryService.save(categoryData)
    return res.status(201).json({
      category,
      message: "Product category created successfully.",
    })
  }

  async update(req: AuthRequest<ICategory>, res: Response, next: NextFunction) {
    const result = validationResult(req)
    if (!result.isEmpty())
      return res.status(400).json({ error: result.array() })

    const categoryId = req.params.categoryId

    const { name } = req.body

    const category = await this.categoryService.getById(categoryId)

    if (!category)
      return next(createHttpError(400, "Product category not found!"))

    category.name = name
    await this.categoryService.save(category)

    return res.json({
      category,
      message: "Product category updated successfully",
    })
  }

  async delete(req: AuthRequest, res: Response, next: NextFunction) {
    const categoryId = req.params.categoryId

    const category = await this.categoryService.getById(categoryId)
    if (!category)
      return next(createHttpError(400, "Product category not found!"))

    await this.categoryService.delete(categoryId)
    return res.json({
      id: categoryId,
      message: "Product category deleted successfully",
    })
  }

  async gets(req: Request, res: Response, next: NextFunction) {
    const categories = await this.categoryService.gets()
    return res.json({ categories })
  }
}

export default CategoryController
