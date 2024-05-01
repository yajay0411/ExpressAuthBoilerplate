import { NextFunction, Request, Response } from "express";
import createHttpError from "http-errors";
import bcrypt from "bcrypt";
import userModel from "../models/UserModel";
import { configuration } from "../config/Config";
import { User } from "../models/UserModel";
import {
  UserLoginSchema,
  UserRegisterSchema,
} from "../validations/UserValidation";
import GenerateJwtToken from "../helper/GenereateJWTSign";
import BlackListReFreshTokenServices from "../services/BlackListReFreshTokenServices";

const registerUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const data = req.body;

  // Validation
  const { value, error } = UserRegisterSchema.validate(data);
  if (error) {
    const err = createHttpError(error);
    return next(err);
  }

  const { first_name, last_name, email, password } = value;

  // Database call.
  try {
    const user = await userModel.findOne({ email });
    if (user) {
      const error = createHttpError(
        400,
        "User already exists with this email."
      );
      return next(error);
    }
  } catch (err) {
    return next(createHttpError(500, "Error while getting user"));
  }

  /// password -> hash
  const hashedPassword = await bcrypt.hash(password, 10);

  let newUser: User;
  try {
    newUser = await userModel.create({
      first_name,
      last_name,
      email,
      password: hashedPassword,
    });
  } catch (err) {
    return next(createHttpError(500, "Error while creating user."));
  }

  try {
    // Create accesstoken
    const access_token = GenerateJwtToken(
      newUser._id,
      configuration.jwt_access_secret as string,
      "10s"
    );

    // Create refreshtoken
    const refresh_token = GenerateJwtToken(
      newUser._id,
      configuration.jwt_refresh_secret as string,
      "1m"
    );

    //access_token
    const token_expires = new Date(Date.now() + 10000);
    res.cookie("access_token", access_token, {
      httpOnly: true,
      secure: true, // Set to true if using HTTPS
      expires: token_expires, // Set the expiration time for the cookie (10 s in this example)
    });

    //refresh_token
    const refresh_expires = new Date(Date.now() + 60000);
    res.cookie("refresh_token", refresh_token, {
      httpOnly: true,
      secure: true, // Set to true if using HTTPS
      expires: refresh_expires, // Set the expiration time for the cookie (1 min in this example)
    });
  } catch (err) {
    return next(createHttpError(500, "Error while signing the jwt token"));
  }

  // Response
  res.status(201).json({ code: 200, message: "User Register Successful" });
};

const loginUser = async (req: Request, res: Response, next: NextFunction) => {
  const data = req.body;

  // Validation
  const { value, error } = UserLoginSchema.validate(data);
  if (error) {
    const err = createHttpError(error);
    return next(err);
  }

  const { email, password } = value;

  // todo: wrap in try catch.
  const user = await userModel.findOne({ email });
  if (!user) {
    return next(createHttpError(404, "User not found."));
  }

  const isMatch = await bcrypt.compare(password, user.password);

  if (!isMatch) {
    return next(createHttpError(400, "Username or password incorrect!"));
  }

  try {
    // Create accesstoken
    const access_token = GenerateJwtToken(
      user._id,
      configuration.jwt_access_secret as string,
      "10s"
    );

    // Create refreshtoken
    const refresh_token = GenerateJwtToken(
      user._id,
      configuration.jwt_refresh_secret as string,
      "1m"
    );

    //access_token
    const token_expires = new Date(Date.now() + 10000);
    res.cookie("access_token", access_token, {
      httpOnly: true,
      secure: true, // Set to true if using HTTPS
      expires: token_expires, // Set the expiration time for the cookie (10 s in this example)
    });

    //refresh_token
    const refresh_expires = new Date(Date.now() + 60000);
    res.cookie("refresh_token", refresh_token, {
      httpOnly: true,
      secure: true, // Set to true if using HTTPS
      expires: refresh_expires, // Set the expiration time for the cookie (1 min in this example)
    });
  } catch (error) {
    return next(createHttpError(500, "Error while signing the jwt token"));
  }

  // Response
  res.status(200).json({ code: 200, message: "Logged In Successful" });
};

const logoutUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // Clear the access token cookie
    res.clearCookie("access_token", {
      httpOnly: true,
      secure: true, // Set to true if using HTTPS
    });
    res.clearCookie("refresh_token", {
      httpOnly: true,
      secure: true, // Set to true if using HTTPS
    });
  } catch (error) {
    return next(error);
  }

  // Blacklist the refresh token
  const refreshToken = req.cookies.refresh_token;
  if (refreshToken) {
    const expirationDate = new Date(Date.now() + 3600000); // Set the expiration date for the blacklist entry (1 hour in this example)
    try {
      await BlackListReFreshTokenServices.BlacklistToken(
        refreshToken,
        expirationDate
      );
    } catch (error) {
      return next(error);
    }
  }
  res.status(200).json({ code: 200, message: "Logged Out Successful" });
};

const getAllUser = async (req: Request, res: Response, next: NextFunction) => {
  const users = await userModel.find();
  if (!users) {
    return next(createHttpError(404, "Users not found."));
  }
  res.json({ users });
};

export { registerUser, loginUser, logoutUser, getAllUser };
