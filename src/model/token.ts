import { Model, model, Schema } from "mongoose"
import { ITokenModel } from "../types"

const tokenSchema = new Schema<ITokenModel>(
  {
    expiresAt: {
      type: Date,
      required: true,
    },

    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true },
)

const TokenModel: Model<ITokenModel> = model<ITokenModel>("Token", tokenSchema)

export default TokenModel
