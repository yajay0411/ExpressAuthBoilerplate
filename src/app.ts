import express, { Request, Response } from "express";
import cors from "cors";
import globalErrorHandler from "./middlewares/GlobalErrorHandler";
import { configuration } from "./config/Config";
import userRouter from "./routes/UserRouter";
import cookieParser from "cookie-parser";

const app = express();

//for cookie parsing
app.use(cookieParser());

//for request body parsing
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

//for cor handling
app.use(
  cors({
    origin: configuration.frontendDomain,
  })
);

// Routes
// Http methods: GET, POST, PUT, PATCH, DELETE
app.get("/", (req: Request, res: Response) => {
  res.json({
    message: `Welcome to Express Boilerplate apis -- DB :: ${configuration.database_connected_to} :: ${configuration.project_name}`,
  });
});

app.use("/api/users", userRouter);

// Global error handler
app.use(globalErrorHandler);

export default app;
