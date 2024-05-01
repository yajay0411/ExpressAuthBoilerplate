import express from "express";
import {
  createUser,
  loginUser,
  logoutUser,
  getAllUser,
} from "../controllers/UserController";
import authenticate from "../middlewares/Auth";

const userRouter = express.Router();

userRouter.post("/register", createUser);
userRouter.post("/login", loginUser);
userRouter.post("/logout", logoutUser);

userRouter.get("/", authenticate, getAllUser);

export default userRouter;
