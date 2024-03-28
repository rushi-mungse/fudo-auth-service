import { Response, NextFunction } from "express"
import { validationResult } from "express-validator"
import { Logger } from "winston"
import createHttpError from "http-errors"

import {
  IChangePassword,
  IForgetPassword,
  IGetUserResponse,
  ILoginData,
  ISendOpt,
  ISetPassword,
  IUpdateFullName,
  IVerifyOtp,
} from "./type"
import { ICredentialService, TJwtPayload, AuthRequest } from "../../types"
import AuthService from "./service"
import TokenService from "../../service/token"
import { UploadApiResponse } from "cloudinary"

class AuthController {
  constructor(
    private authService: AuthService,
    private credentialService: ICredentialService,
    private tokenService: TokenService,
    private uploadFile: (localPath: string) => Promise<UploadApiResponse>,
    private logger: Logger,
  ) {}

  async sendOtp(req: AuthRequest<ISendOpt>, res: Response, next: NextFunction) {
    /**
     * validate req body data
     */
    const result = validationResult(req)
    if (!result.isEmpty())
      return next(createHttpError(400, result.array()[0].msg as string))

    const { fullName, email, password, confirmPassword } = req.body
    this.logger.info({ fullName, email })

    /**
     * password and confirm password does not match
     */
    if (password !== confirmPassword) {
      const err = createHttpError(
        400,
        "Confirm password does not match to password!",
      )
      return next(err)
    }

    /**
     * if user already register with req email
     */
    const user = await this.authService.getByEmail(email)
    if (user) {
      return next(createHttpError(400, "This email already registered!"))
    }

    /**
     * create hash password
     */
    const hashPassword = await this.credentialService.hashData(password)

    const ttl = 1000 * 60 * 15
    const expires = Date.now() + ttl

    /**
     * generate otp and hash otp
     */
    const otp = this.credentialService.getOtp()
    const dataForHash = `${otp}.${email}.${expires}.${hashPassword}`
    const hashData = this.credentialService.hashDataWithSecret(dataForHash)
    const hashOtp = `${hashData}#${expires}#${hashPassword}`

    /**
     * respose
     */
    const otpInfo = { fullName, email, hashOtp }
    return res.json({
      otpInfo,
      otp, //TODO: remove production level
      message: "Otp sent by user email successfully!",
    })
  }

  async verifyOtp(
    req: AuthRequest<IVerifyOtp>,
    res: Response,
    next: NextFunction,
  ) {
    /**
     * validate req body data
     */
    const result = validationResult(req)
    if (!result.isEmpty())
      return next(createHttpError(400, result.array()[0].msg as string))

    const { fullName, email, hashOtp, otp } = req.body
    this.logger.info({ fullName, email })

    /**
     * validate hashotp
     */
    if (hashOtp.split("#").length !== 3) {
      const error = createHttpError(400, "Otp is invalid!")
      return next(error)
    }

    const [prevHashOtp, expires, hashPassword] = hashOtp.split("#")

    /**
     * if user already registered
     */
    const user = await this.authService.getByEmail(email)
    if (user) {
      const error = createHttpError(400, "This email already registered.")
      return next(error)
    }

    /**
     * if otp is expires
     */
    if (Date.now() > +expires) {
      const error = createHttpError(408, "Otp is expired.")
      return next(error)
    }

    const dataForHash = `${otp}.${email}.${expires}.${hashPassword}`
    const curHashOtp = this.credentialService.hashDataWithSecret(dataForHash)

    /**
     * if hash otp does not match
     */
    if (curHashOtp !== prevHashOtp) {
      const error = createHttpError(400, "Otp is invalid.")
      return next(error)
    }

    const newUser = await this.authService.save({
      fullName,
      email,
      password: hashPassword,
    })

    const payload: TJwtPayload = {
      userId: String(newUser._id),
      role: newUser.role!,
    }

    const accessToken = this.tokenService.signAccessToken(payload)
    const MS_IN_YEAR = 1000 * 60 * 60 * 24 * 365
    const expiresAt = new Date(Date.now() + MS_IN_YEAR)
    const token = await this.tokenService.save({
      userId: newUser._id,
      expiresAt,
    })
    const refreshToken = this.tokenService.signRefreshToken({
      ...payload,
      tokenId: String(token.id),
    })

    /**
     * set cookies
     */
    res.cookie("accessToken", accessToken, {
      secure: true,
      sameSite: "none",
      httpOnly: true,
      maxAge: 1000 * 60 * 60 * 24,
    })

    res.cookie("refreshToken", refreshToken, {
      secure: true,
      sameSite: "none",
      httpOnly: true,
      maxAge: 1000 * 60 * 60 * 24 * 365,
    })

    return res
      .status(201)
      .json({ user: newUser, message: "User registered successfully." })
  }

  async self(req: AuthRequest, res: Response, next: NextFunction) {
    const userId = req.auth.userId
    const user = await this.authService.getById(userId)
    if (!user) return next(createHttpError(400, "User not found!"))
    return res.json({ user })
  }

  async logout(req: AuthRequest, res: Response, next: NextFunction) {
    const tokenId = req.auth.tokenId

    if (!tokenId) return next(createHttpError(400, "Your not valid user."))

    await this.tokenService.delete(tokenId)

    res.clearCookie("accessToken", {
      secure: true,
      sameSite: "none",
      httpOnly: true,
    })

    res.clearCookie("refreshToken", {
      secure: true,
      sameSite: "none",
      httpOnly: true,
    })

    return res.json({
      user: null,
      message: "User successfully logout.",
    })
  }

  async login(req: AuthRequest<ILoginData>, res: Response, next: NextFunction) {
    const result = validationResult(req)
    if (!result.isEmpty())
      return res.status(400).json({ error: result.array() })

    const { email, password } = req.body

    const user = await this.authService.getByEmail(email)
    if (!user) {
      const error = createHttpError(400, "Email or Password does not match!")
      return next(error)
    }
    const isMatch = await this.credentialService.hashCompare(
      password,
      user.password,
    )

    if (!isMatch)
      return next(createHttpError(400, "Email or Password does not match!"))

    const payload: TJwtPayload = {
      userId: String(user.id),
      role: user.role!,
    }

    const accessToken = this.tokenService.signAccessToken(payload)
    const MS_IN_YEAR = 1000 * 60 * 60 * 24 * 365
    const expiresAt = new Date(Date.now() + MS_IN_YEAR)
    const token = await this.tokenService.save({ userId: user._id, expiresAt })
    const refreshToken = this.tokenService.signRefreshToken({
      ...payload,
      tokenId: String(token.id),
    })

    res.cookie("accessToken", accessToken, {
      secure: true,
      sameSite: "none",
      httpOnly: true,
      maxAge: 1000 * 60 * 60 * 24,
    })

    res.cookie("refreshToken", refreshToken, {
      secure: true,
      sameSite: "none",
      httpOnly: true,
      maxAge: 1000 * 60 * 60 * 24 * 365,
    })

    return res.json({
      user,
      message: "User login successfully.",
    })
  }

  async refresh(req: AuthRequest, res: Response, next: NextFunction) {
    const auth = req.auth
    if (!auth.tokenId)
      return next(createHttpError(400, "Invalid user has not tokenId."))

    const user = await this.authService.getById(auth.userId)
    if (!user) {
      const error = createHttpError(400, "User whit token could not found!")
      return next(error)
    }

    await this.tokenService.delete(auth.tokenId)

    const payload: TJwtPayload = {
      userId: String(user.id),
      role: user.role!,
    }

    const MS_IN_YEAR = 1000 * 60 * 60 * 24 * 365
    const expiresAt = new Date(Date.now() + MS_IN_YEAR)
    const token = await this.tokenService.save({
      userId: user._id,
      expiresAt,
    })

    const accessToken = this.tokenService.signAccessToken(payload)
    const refreshToken = this.tokenService.signRefreshToken({
      ...payload,
      tokenId: String(token.id),
    })

    res.cookie("accessToken", accessToken, {
      secure: true,
      sameSite: "none",
      httpOnly: true,
      maxAge: 1000 * 60 * 60 * 24,
    })

    res.cookie("refreshToken", refreshToken, {
      secure: true,
      sameSite: "none",
      httpOnly: true,
      maxAge: 1000 * 60 * 60 * 24 * 365,
    })
    return res.json({ user })
  }

  async forgetPassword(
    req: AuthRequest<IForgetPassword>,
    res: Response,
    next: NextFunction,
  ) {
    const result = validationResult(req)
    if (!result.isEmpty())
      return res.status(400).json({ error: result.array() })

    const { email } = req.body

    const user = await this.authService.getByEmail(email)
    if (!user) {
      return next(createHttpError(400, "This email is not registered!"))
    }

    const ttl = 1000 * 60 * 10
    const expires = Date.now() + ttl
    const otp = this.credentialService.getOtp()
    const prepareDataForHash = `${otp}.${email}.${expires}`
    const hashOtpData =
      this.credentialService.hashDataWithSecret(prepareDataForHash)
    const hashOtp = `${hashOtpData}#${expires}`

    const otpInfo = {
      fullName: user.fullName,
      email,
      hashOtp,
    }
    return res.json({
      otpInfo,
      otp,
    })
  }

  async setPassword(
    req: AuthRequest<ISetPassword>,
    res: Response,
    next: NextFunction,
  ) {
    const result = validationResult(req)
    if (!result.isEmpty()) {
      return res.status(400).json({ error: result.array() })
    }

    const { email, hashOtp, otp, password, confirmPassword } = req.body

    if (password !== confirmPassword) {
      const err = createHttpError(
        400,
        "confirm password not match to password!",
      )
      return next(err)
    }

    if (hashOtp.split("#").length !== 2) {
      const error = createHttpError(400, "Otp is invalid!")
      return next(error)
    }

    const [prevHashedOtp, expires] = hashOtp.split("#")

    const user = await this.authService.getByEmail(email)
    if (!user) {
      return next(createHttpError(400, "This email is not registered!"))
    }

    if (Date.now() > +expires) {
      const error = createHttpError(408, "Otp is expired!")
      return next(error)
    }

    const data = `${otp}.${email}.${expires}`
    const hashData = this.credentialService.hashDataWithSecret(data)

    if (hashData !== prevHashedOtp) {
      const error = createHttpError(400, "Otp is invalid!")
      return next(error)
    }

    const hashPassword = await this.credentialService.hashData(password)
    user.password = hashPassword
    await this.authService.save(user)

    return res.json({ user })
  }

  async updateFullName(
    req: AuthRequest<IUpdateFullName>,
    res: Response,
    next: NextFunction,
  ) {
    const result = validationResult(req)
    if (!result.isEmpty())
      return res.status(400).json({ error: result.array() })

    const userId = req.auth.userId
    const { fullName } = req.body

    const user = await this.authService.getById(userId)
    if (!user) return next(createHttpError(400, "User not found!"))

    user.fullName = fullName
    await this.authService.save(user)

    return res.json({
      user,
      message: "Updated user full name successfully.",
    })
  }

  async changePassword(
    req: AuthRequest<IChangePassword>,
    res: Response,
    next: NextFunction,
  ) {
    const result = validationResult(req)
    if (!result.isEmpty())
      return res.status(400).json({ error: result.array() })

    const userId = req.auth.userId
    const { newPassword, oldPassword } = req.body

    const user = await this.authService.getById(userId)
    if (!user) return next(createHttpError(400, "User not found!"))

    const hashPassword = user.password
    const isMatch = await this.credentialService.hashCompare(
      oldPassword,
      hashPassword,
    )
    if (!isMatch)
      return next(createHttpError(400, "Old password does not match!"))
    const newHashPassword = await this.credentialService.hashData(newPassword)

    user.password = newHashPassword
    await this.authService.save(user)

    return res.json({
      id: user._id,
      message: "User password changed successfully",
    })
  }

  async delete(req: AuthRequest, res: Response, next: NextFunction) {
    const userId = req.auth.userId

    const user = await this.authService.getById(userId)
    if (!user) return next(createHttpError(400, "User not found!"))

    await this.tokenService.deleteUsingUserId(user._id as string)
    await this.authService.delete(userId)

    res.clearCookie("accessToken")
    res.clearCookie("refreshToken")

    return res.json({
      user: null,
      message: "User deleted successfully",
    })
  }

  async updateUserProfilePicture(
    req: AuthRequest,
    res: Response,
    next: NextFunction,
  ) {
    const userId = req.auth.userId
    const file = req.file
    if (!file) return next(createHttpError(400, "User picture not found!"))

    const user = await this.authService.getById(userId)
    if (!user) return next(createHttpError(400, "User not found!"))

    const uploadedFile = await this.uploadFile(file.path)
    user.avatar = uploadedFile.url

    await this.authService.save(user)
    return res.json({
      user,
      message: "User profile picture updated successfully.",
    })
  }

  async getUsers(req: AuthRequest, res: Response, next: NextFunction) {
    const { perPage, currentPage, q } = req.query as unknown as {
      perPage: number
      currentPage: number
      q: string
    }

    const data = (await this.authService.gets({
      perPage,
      currentPage,
      q,
    })) as unknown as [IGetUserResponse]

    if (!data[0].metadata.length)
      return res.json({
        users: [],
        metadata: {
          totolCount: 0,
          perPage,
          currentPage,
        },
      })

    return res.json({
      users: data[0].data,
      metadata: {
        totalCount: data[0].metadata[0].totalCount,
        perPage,
        currentPage,
      },
    })
  }

  async getUser(req: AuthRequest, res: Response, next: NextFunction) {
    const userId = req.params.userId
    if (!userId) return next(createHttpError(400, "Invalid user id!"))

    const user = await this.authService.getById(userId)
    if (!user) return next(createHttpError(400, "User not found!"))
    return res.json({ user })
  }

  async deleteUserByAdmin(req: AuthRequest, res: Response, next: NextFunction) {
    const userId = req.params.userId
    if (!userId) return next(createHttpError(400, "Invalid user id!"))

    try {
      const user = await this.authService.getById(userId)
      if (!user) return next(createHttpError(400, "User not found!"))

      await this.authService.delete(userId)
      return res.json({
        id: userId,
        message: "User deleted successfully.",
      })
    } catch (error) {
      return next(error)
    }
  }
}

export default AuthController
