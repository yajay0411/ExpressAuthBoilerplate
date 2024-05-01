import { NextFunction, Request, Response } from "express";
import createHttpError from "http-errors";
import { configuration } from "../config/Config";
import BlacklistedRefreshTokenModel from "../models/BlacklistedRefreshTokenModel";
import GenerateJwtToken from "../helper/GenereateJWTSign";
import VerifyJwtToken from "../helper/ValidateJWTSign";

export interface AuthRequest extends Request {
  userId: string;
}
const authenticate = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const access_token = req.cookies.access_token;

  if (!access_token) {
    const refresh_token = req.cookies.refresh_token;

    const refresh_token_black_listed =
      await BlacklistedRefreshTokenModel.findOne({ refresh_token });

    if (!refresh_token || refresh_token_black_listed) {
      return next(createHttpError(401, "Authorization token is required."));
    }

    try {
      const decoded = VerifyJwtToken(
        refresh_token,
        configuration.jwt_refresh_secret as string
      );

      const _req = req as AuthRequest;
      _req.userId = decoded.sub as string;

      if (decoded) {
        // Create accesstoken

        const access_token = GenerateJwtToken(
          _req.userId,
          configuration.jwt_access_secret as string,
          "10s"
        );

        // Create accesstoken
        const refresh_token = GenerateJwtToken(
          _req.userId,
          configuration.jwt_refresh_secret as string,
          "1m"
        );

        //access_token
        res.cookie("access_token", access_token, {
          httpOnly: true,
          secure: true, // Set to true if using HTTPS
          expires: new Date(Date.now() + 10000), // Set the expiration time for the cookie (10 s in this example)
        });

        //access_token
        res.cookie("refresh_token", refresh_token, {
          httpOnly: true,
          secure: true, // Set to true if using HTTPS
          expires: new Date(Date.now() + 60000), // Set the expiration time for the cookie (1 min in this example)
        });
      }

      next();
    } catch (err) {
      return next(createHttpError(401, "Token expired."));
    }
  } else {
    try {
      const decoded = VerifyJwtToken(
        access_token,
        configuration.jwt_access_secret as string
      );

      const _req = req as AuthRequest;
      _req.userId = decoded.sub as string;

      next();
    } catch (err) {
      return next(createHttpError(401, "Token expired."));
    }
  }
};

export default authenticate;
