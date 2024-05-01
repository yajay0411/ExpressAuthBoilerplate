import BlacklistedRefreshTokenModel from "../models/BlacklistedRefreshTokenModel";

export default class BlackListReFreshTokenServices {
  static BlacklistToken = async (
    refresh_token: string,
    expirationDate: Date
  ) => {
    await BlacklistedRefreshTokenModel.create({
      refresh_token,
      expiresAt: expirationDate,
    });
  };
}
