import express, { Request, Response } from "express";
import cors from "cors";
import globalErrorHandler from "./middlewares/GlobalErrorHandler";
import { configuration } from "./config/Config";
import userRouter from "./routes/UserRouter";

const app = express();

app.use(
  cors({
    origin: configuration.frontendDomain,
  })
);

app.use(express.json());

// Routes
// Http methods: GET, POST, PUT, PATCH, DELETE
app.get("/", (req: Request, res: Response) => {
  res.json({
    message: `Welcome to Express Boilerplate apis -- DB :: ${configuration.database_connected_to}`,
  });
});

app.use("/api/users", userRouter);

// Global error handler
app.use(globalErrorHandler);

export default app;
