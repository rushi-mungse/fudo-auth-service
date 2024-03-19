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

  async gets(): Promise<(typeof UserModel)[]> {
    return await this.userModel.find()
  }

  async delete(userId: string) {
    return await this.userModel.deleteOne({ _id: userId })
  }
}

export default AuthService
