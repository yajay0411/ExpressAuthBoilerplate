import express from "express";
import {
  createUser,
  loginUser,
  getAllUser,
} from "../controllers/UserController";
import authenticate from "../middlewares/Auth";
import { configuration } from "../config/Config";
import {
  getAllUserMysql,
  loginUserMysql,
  registerUserMysql,
} from "../controllers/UserControllerMySql";

const userRouter = express.Router();

if (configuration.database_connected_to === "MONGODB") {
  userRouter.post("/register", createUser);
  userRouter.post("/login", loginUser);

  userRouter.get("/", authenticate, getAllUser);
}

if (configuration.database_connected_to === "MYSQLDB") {
  // routes
  userRouter.post("/register", registerUserMysql);
  userRouter.post("/login", loginUserMysql);

  userRouter.get("/", authenticate, getAllUserMysql);
}

export default userRouter;
