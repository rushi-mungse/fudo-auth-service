import express, { NextFunction, Response, Request } from "express"

import logger from "../config/logger"
import {
  AuthRequest,
  IForgetPassword,
  ILoginData,
  ISendOpt,
  ISetPassword,
  IUpdateFullName,
  IVerifyOtp,
} from "./type"
import { asyncWrapper } from "../utils/async-wrapper"

import AuthController from "./controller"

import verifyOtpValidator from "./validators/verify-otp-validator"
import sendOtpValidator from "./validators/send-otp-validator"

import TokenService from "../service/token"
import AuthService from "./service"
import CredentialService from "../service/credential"

import TokenModel from "../model/token"
import UserModel from "./model"

import checkAccessToken from "../middleware/access-token"
import checkRefreshToken from "../middleware/refresh-token"
import invalidToken from "../middleware/invalid-token"
import loginVlaidator from "./validators/login-validator"
import forgetPasswordValidator from "./validators/forget-password-validator"
import setPasswordValidator from "./validators/set-password-validator"
import updateFullNameValidator from "./validators/update-fullname-validator"

const authRouter = express.Router()
const tokenService = new TokenService(TokenModel)
const authService = new AuthService(UserModel)
const credentialService = new CredentialService()
const authController = new AuthController(
  authService,
  credentialService,
  tokenService,
  logger,
)

authRouter.post(
  "/send-otp",
  sendOtpValidator,
  asyncWrapper((req: Request, res: Response, next: NextFunction) =>
    authController.sendOtp(req as AuthRequest<ISendOpt>, res, next),
  ),
)

authRouter.post(
  "/verify-otp",
  verifyOtpValidator,
  asyncWrapper((req: Request, res: Response, next: NextFunction) =>
    authController.verifyOtp(req as AuthRequest<IVerifyOtp>, res, next),
  ),
)

authRouter.get(
  "/self",
  [checkAccessToken],
  asyncWrapper((req: Request, res: Response, next: NextFunction) =>
    authController.self(req as AuthRequest, res, next),
  ),
)

authRouter.get(
  "/logout",
  [checkAccessToken, checkRefreshToken],
  asyncWrapper((req: Request, res: Response, next: NextFunction) =>
    authController.logout(req as AuthRequest, res, next),
  ),
)

authRouter.post(
  "/login",
  loginVlaidator,
  [invalidToken],
  asyncWrapper((req: Request, res: Response, next: NextFunction) =>
    authController.login(req as AuthRequest<ILoginData>, res, next),
  ),
)

authRouter.get(
  "/refresh",
  [checkRefreshToken],
  asyncWrapper((req: Request, res: Response, next: NextFunction) =>
    authController.refresh(req as AuthRequest, res, next),
  ),
)

authRouter.post(
  "/forget-password",
  forgetPasswordValidator,
  [invalidToken],
  asyncWrapper((req: Request, res: Response, next: NextFunction) =>
    authController.forgetPassword(
      req as AuthRequest<IForgetPassword>,
      res,
      next,
    ),
  ),
)

authRouter.post(
  "/set-password",
  setPasswordValidator,
  [invalidToken],
  asyncWrapper((req: Request, res: Response, next: NextFunction) =>
    authController.setPassword(req as AuthRequest<ISetPassword>, res, next),
  ),
)

authRouter.post(
  "/update-fullname",
  updateFullNameValidator,
  [checkAccessToken],
  asyncWrapper((req: Request, res: Response, next: NextFunction) =>
    authController.updateFullName(
      req as AuthRequest<IUpdateFullName>,
      res,
      next,
    ),
  ),
)

export default authRouter
