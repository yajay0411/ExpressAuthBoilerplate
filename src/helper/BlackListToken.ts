import BlacklistedRefreshTokenModel from "../models/BlacklistedRefreshTokenModel";

const BlacklistToken = async (refresh_token: string, expirationDate: Date) => {
  const data = await BlacklistedRefreshTokenModel.create({
    refresh_token,
    expiresAt: expirationDate,
  });
};

export default BlacklistToken;
