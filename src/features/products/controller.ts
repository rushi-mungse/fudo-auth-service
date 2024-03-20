import { validationResult } from "express-validator"
import createHttpError from "http-errors"
import { Request, NextFunction, Response } from "express"

import { AuthRequest } from "../../types"
import { IAttribute, IPriceConfiguration, IProduct, IProductBody } from "./type"
import ProductService from "./service"
import { UploadApiResponse } from "cloudinary"

class ProductController {
  constructor(
    private productService: ProductService,
    private uploadFile: (localPath: string) => Promise<UploadApiResponse>,
  ) {}

  async create(
    req: AuthRequest<IProductBody>,
    res: Response,
    next: NextFunction,
  ) {
    const result = validationResult(req)
    if (!result.isEmpty())
      return next(createHttpError(400, result.array()[0].msg as string))

    const file = req.file
    if (!file) return next(createHttpError(400, "Product image not found!"))

    const uploadedFile = await this.uploadFile(file.path)

    const {
      name,
      description,
      isPublish,
      discount,
      categoryId,
      preparationTime,
      attributes,
      priceConfiguration,
    } = req.body

    const productData: IProduct = {
      name,
      image: uploadedFile.url,
      isPublish: JSON.parse(isPublish) as boolean,
      description,
      discount: JSON.parse(discount) as number,
      categoryId: categoryId,
      preparationTime: JSON.parse(preparationTime) as number,
      attributes: JSON.parse(attributes) as IAttribute[],
      priceConfiguration: JSON.parse(priceConfiguration) as IPriceConfiguration,
    }

    const product = await this.productService.save(productData)

    return res.json({ product })
  }

  async update(
    req: AuthRequest<IProductBody>,
    res: Response,
    next: NextFunction,
  ) {
    const result = validationResult(req)
    if (!result.isEmpty())
      return next(createHttpError(400, result.array()[0].msg as string))

    const productId = req.params.productId
    const product = await this.productService.getById(productId)
    if (!product) return next(createHttpError(400, "Product not found."))

    const file = req.file
    if (file) {
      //TODO: delete old image
      const uploadedFile = await this.uploadFile(file.path)
      product.image = uploadedFile.url
    }

    const {
      name,
      description,
      isPublish,
      discount,
      categoryId,
      preparationTime,
      attributes,
      priceConfiguration,
    } = req.body

    const productData: IProduct = {
      name,
      image: product.image,
      isPublish: JSON.parse(isPublish) as boolean,
      description,
      discount: JSON.parse(discount) as number,
      categoryId: categoryId,
      preparationTime: JSON.parse(preparationTime) as number,
      attributes: JSON.parse(attributes) as IAttribute[],
      priceConfiguration: JSON.parse(priceConfiguration) as IPriceConfiguration,
    }

    product.name = productData.name
    product.image = productData.image
    product.isPublish = productData.isPublish
    product.description = productData.description
    product.discount = productData.discount
    product.categoryId = productData.categoryId
    product.preparationTime = productData.preparationTime
    product.attributes = productData.attributes
    product.priceConfiguration = productData.priceConfiguration

    const newProduct = await this.productService.save(product)

    return res.json({ product: newProduct })
  }

  async delete(req: AuthRequest, res: Response, next: NextFunction) {
    const productId = req.params.productId

    const product = await this.productService.getById(productId)
    if (!product) {
      return next(createHttpError(400, "Product not found!"))
    }

    await this.productService.delete(productId)

    res.json({ productId, message: "Product deleted successfully." })
  }

  async gets(req: Request, res: Response, next: NextFunction) {
    const products = await this.productService.gets()
    res.json({ products, message: "Product deleted successfully." })
  }

  async get(req: Request, res: Response, next: NextFunction) {
    const productId = req.params.productId

    const product = await this.productService.getById(productId)
    if (!product) {
      return next(createHttpError(400, "Product not found!"))
    }

    res.json({ product, message: "Product deleted successfully." })
  }
}

export default ProductController
