import { NextFunction, Request, Response } from "express";
import createHttpError from "http-errors";
import bcrypt from "bcrypt";
import userModel, { UserAttributes } from "../models/UserModelsMySql";
import { sign } from "jsonwebtoken";
import { configuration } from "../config/Config";
import {
  UserLoginSchema,
  UserRegisterSchema,
} from "../validations/UserValidation";

const registerUserMysql = async (
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
    const user = await userModel.findOne({ where: { email } });
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

  let newUser: UserAttributes;
  try {
    newUser = await userModel.create({
      first_name,
      last_name,
      email,
      password: hashedPassword,
    });
  } catch (err) {
    return next(createHttpError(500, `Error while creating user:${err}`));
  }

  try {
    // Token generation JWT
    const token = sign({ sub: newUser.id }, configuration.jwtSecret as string, {
      expiresIn: "1m",
      algorithm: "HS256",
    });
    // Response
    res.status(201).json({ accessToken: token });
  } catch (err) {
    return next(createHttpError(500, "Error while signing the jwt token"));
  }
};

const loginUserMysql = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const data = req.body;

  // Validation
  const { value, error } = UserLoginSchema.validate(data);
  if (error) {
    const err = createHttpError(error);
    return next(err);
  }

  const { email, password } = value;

  // todo: wrap in try catch.
  const user = await userModel.findOne({ where: { email } });
  if (!user) {
    return next(createHttpError(404, "User not found."));
  }

  const isMatch = await bcrypt.compare(password, user.password);

  if (!isMatch) {
    return next(createHttpError(400, "Username or password incorrect!"));
  }

  // todo: handle errors
  // Create accesstoken
  const token = sign({ sub: user.id }, configuration.jwtSecret as string, {
    expiresIn: "1m",
    algorithm: "HS256",
  });

  res.json({ accessToken: token });
};

const getAllUserMysql = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const users = await userModel.findAll();
  if (!users) {
    return next(createHttpError(404, "Users not found."));
  }
  res.json({ users });
};

export { registerUserMysql, loginUserMysql, getAllUserMysql };
