import { GetQueryParams } from "../../types"
import UserModel from "./model"
import { IUser } from "./type"

class AuthService {
  constructor(private userModel: typeof UserModel) {}

  async getById(userId: string) {
    return await this.userModel.findById(userId)
  }

  async getByEmail(userEmail: string) {
    return await this.userModel.findOne({ email: userEmail })
  }

  async save(userData: IUser) {
    const user = new this.userModel(userData)
    return await user.save()
  }

  async gets({ perPage, currentPage, q }: GetQueryParams) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return await UserModel.aggregate([
      ...(q
        ? [
            {
              $match: {
                fullName: {
                  $regex: new RegExp(q, "i"),
                },
              },
            },
          ]
        : []),
      {
        $facet: {
          metadata: [{ $count: "totalCount" }],
          data: [{ $skip: (currentPage - 1) * perPage }, { $limit: perPage }],
        },
      },
    ])
  }

  async delete(userId: string) {
    return await this.userModel.deleteOne({ _id: userId })
  }
}

export default AuthService
