import { NextFunction, Request, Response } from "express";
import createHttpError from "http-errors";
import bcrypt from "bcrypt";
import userModel from "../models/UserModel";
import { sign } from "jsonwebtoken";
import { configuration } from "../config/Config";
import { User } from "../models/UserModel";
import {
  UserLoginSchema,
  UserRegisterSchema,
} from "../validations/UserValidation";

const createUser = async (req: Request, res: Response, next: NextFunction) => {
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
    // Token generation JWT
    const token = sign(
      { sub: newUser._id },
      configuration.jwtSecret as string,
      {
        expiresIn: "1m",
        algorithm: "HS256",
      }
    );
    // Response
    res.status(201).json({ accessToken: token });
  } catch (err) {
    return next(createHttpError(500, "Error while signing the jwt token"));
  }
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

  // todo: handle errors
  // Create accesstoken
  const token = sign({ sub: user._id }, configuration.jwtSecret as string, {
    expiresIn: "1m",
    algorithm: "HS256",
  });

  res.json({ accessToken: token });
};

const getAllUser = async (req: Request, res: Response, next: NextFunction) => {
  const users = await userModel.find();
  if (!users) {
    return next(createHttpError(404, "Users not found."));
  }
  res.json({ users });
};

export { createUser, loginUser, getAllUser };
