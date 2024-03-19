import { Model, model, Schema } from "mongoose"
import { IUserModel } from "./type"
import { UserRoles, UserStatus } from "./constants"

const userShecma = new Schema<IUserModel>(
  {
    fullName: {
      type: String,
      require: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
    },

    password: {
      type: String,
      required: true,
    },

    role: {
      type: String,
      enum: UserRoles,
      default: "customer",
      required: false,
    },

    phoneNumber: {
      type: String,
      required: false,
    },

    countryCode: {
      type: String,
      required: false,
    },

    avatar: {
      type: String,
      required: false,
    },

    status: {
      type: String,
      enum: UserStatus,
      default: "valid",
      required: false,
    },
  },
  { timestamps: true },
)

const UserModel: Model<IUserModel> = model<IUserModel>("User", userShecma)

export default UserModel
