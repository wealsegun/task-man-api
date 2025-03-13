import { Account } from "../entities/account.entity";
import { UserProfile, UserProfileResponse } from "../interfaces/userProfile.interface";

export class ModelFactory {

    static async getUserProfile(token: string, refreshToken: string, user: Account): Promise<UserProfileResponse> {
        var _model: UserProfileResponse = {
            accessToken: token,
            refreshToken: refreshToken,
            user: await this.userProfile(user)

        }
        return _model;
    }
    static async userProfile(model: Account) {
        var _model: UserProfile = {
            id: model.id,
            createdAt: model.createdAt,
            email: model.email,
            firstName: model.firstName,
            gender: model.gender,
            lastName: model.lastName,
            phoneNumber: model.phoneNumber,
            role: model.role

        }
        return _model;
    }


}