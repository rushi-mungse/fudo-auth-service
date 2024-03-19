import express, {
  Request,
  Response,
  NextFunction,
  RequestHandler,
} from "express"

import CategoryController from "./controller"
import { asyncWrapper } from "../utils/async-wrapper"

import { AuthRequest } from "../types"
import { ICategory } from "./type"

import CategoryModel from "./model"

import categoryValidator from "./validator/category-validator"

import CategoryService from "./service"
import hasPermission from "../middleware/permission"
import { UserRoles } from "../constants"
import checkAccessToken from "../middleware/access-token"

const categoryRouter = express.Router()
const categoryService = new CategoryService(CategoryModel)
const categoryController = new CategoryController(categoryService)

categoryRouter.post(
  "/",
  categoryValidator,
  [checkAccessToken, hasPermission([UserRoles.ADMIN]) as RequestHandler],
  asyncWrapper((req: Request, res: Response, next: NextFunction) =>
    categoryController.create(req as AuthRequest<ICategory>, res, next),
  ),
)

categoryRouter.get(
  "/",
  asyncWrapper((req: Request, res: Response, next: NextFunction) =>
    categoryController.gets(req, res, next),
  ),
)

categoryRouter.put(
  "/:categoryId",
  categoryValidator,
  [checkAccessToken, hasPermission([UserRoles.ADMIN]) as RequestHandler],
  asyncWrapper((req: Request, res: Response, next: NextFunction) =>
    categoryController.update(req as AuthRequest<ICategory>, res, next),
  ),
)

categoryRouter.delete(
  "/:categoryId",
  [checkAccessToken, hasPermission([UserRoles.ADMIN]) as RequestHandler],
  asyncWrapper((req: Request, res: Response, next: NextFunction) =>
    categoryController.delete(req as AuthRequest, res, next),
  ),
)

export default categoryRouter
