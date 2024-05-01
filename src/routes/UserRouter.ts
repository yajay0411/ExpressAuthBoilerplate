import express from "express";
import {
  registerUser,
  loginUser,
  logoutUser,
  getAllUser,
} from "../controllers/UserController";
import authenticate from "../middlewares/Auth";

const userRouter = express.Router();

userRouter.post("/register", registerUser);
userRouter.post("/login", loginUser);
userRouter.post("/logout", logoutUser);

userRouter.get("/", authenticate, getAllUser);

export default userRouter;
