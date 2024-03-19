import { Request } from "express-jwt"
import { TJwtPayload } from "../types"
import { Document } from "mongoose"

export type Maybe<T> = T | null | undefined

export interface IUser {
  fullName: string
  email: string
  password: string
  role?: "admin" | "customer"
  phoneNumber?: string
  countryCode?: string
  avatar?: string
  status?: "valid" | "active" | "banned"
}

export type IUserModel = IUser & Document

export interface AuthRequest<Body = null> extends Request {
  auth: TJwtPayload
  body: Body
}

export interface ISendOpt {
  fullName: string
  email: string
  password: string
  confirmPassword: string
}

export interface IVerifyOtp {
  fullName: string
  email: string
  hashOtp: string
  otp: string
}

export interface ILoginData {
  email: string
  password: string
}

export interface IForgetPassword {
  email: string
}

export interface ISetPassword {
  email: string
  password: string
  confirmPassword: string
  otp: string
  hashOtp: string
}

export interface IUpdateFullName {
  fullName: string
}
