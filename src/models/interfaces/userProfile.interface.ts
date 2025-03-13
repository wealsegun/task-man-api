export interface UserProfileResponse {
    accessToken: string;
    refreshToken: string;
    user: UserProfile

}

export interface UserProfile {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    gender: string;
    phoneNumber: string;
    role: string;
    createdAt: Date;
}
