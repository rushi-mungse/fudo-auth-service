import express, {
  NextFunction,
  Request,
  RequestHandler,
  Response,
} from "express"

import { asyncWrapper } from "../../utils/async-wrapper"
import ProductController from "./controller"
import { AuthRequest } from "../../types"
import { IProductBody } from "./type"
import uploadFile from "../../middleware/uploadFile"
import checkAccessToken from "../../middleware/access-token"
import ProductService from "./service"
import ProductModel from "./model"
import uploadOnCloudinary from "../../config/uploadOnCloudinary"
import hasPermission from "../../middleware/permission"
import { UserRoles } from "../../constants"
import createProductValidator from "./validators/create-product-validator"
import { queryParamsValidator } from "./validators/query-params-validator"

const productRouter = express.Router()
const productService = new ProductService(ProductModel)
const productController = new ProductController(
  productService,
  uploadOnCloudinary,
)

productRouter.post(
  "/",
  [
    checkAccessToken,
    uploadFile.single("image"),
    hasPermission([UserRoles.ADMIN]) as unknown as RequestHandler,
    createProductValidator as unknown as RequestHandler,
  ],
  asyncWrapper((req: Request, res: Response, next: NextFunction) =>
    productController.create(req as AuthRequest<IProductBody>, res, next),
  ),
)

productRouter.put(
  "/:productId",
  [
    checkAccessToken,
    uploadFile.single("image"),
    hasPermission([UserRoles.ADMIN]) as unknown as RequestHandler,
    createProductValidator as unknown as RequestHandler,
  ],
  asyncWrapper((req: Request, res: Response, next: NextFunction) =>
    productController.update(req as AuthRequest<IProductBody>, res, next),
  ),
)

productRouter.delete(
  "/:productId",
  [
    checkAccessToken,
    uploadFile.single("image"),
    hasPermission([UserRoles.ADMIN]) as unknown as RequestHandler,
  ],
  asyncWrapper((req: Request, res: Response, next: NextFunction) =>
    productController.delete(req as AuthRequest, res, next),
  ),
)

productRouter.get(
  "/",
  queryParamsValidator,
  asyncWrapper((req: Request, res: Response, next: NextFunction) =>
    productController.gets(req, res, next),
  ),
)

productRouter.get(
  "/:productId",
  asyncWrapper((req: Request, res: Response, next: NextFunction) =>
    productController.get(req, res, next),
  ),
)

export default productRouter
