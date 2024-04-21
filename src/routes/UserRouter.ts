import express from "express";
import {
  createUser,
  loginUser,
  getAllUser,
} from "../controllers/UserController";
import authenticate from "../middlewares/Auth";

const userRouter = express.Router();

// routes
userRouter.post("/register", createUser);
userRouter.post("/login", loginUser);

userRouter.get("/", authenticate, getAllUser);

export default userRouter;
