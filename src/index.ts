import express, { urlencoded, Request, Response, NextFunction } from "express";
import "dotenv/config";
import IndexRouter from "./Routes/index";

const app = express();
const cors = require("cors");

const PORT: any = process.env.PORT ?? 8085;

app.listen(PORT, () => {
  console.log(`Server is running on Port ${PORT}`);
});
app.use(cors());
app.use(express.json());
app.use(urlencoded({ extended: true }));
app.use("/api/v1", IndexRouter);
app.use((req: Request, res: Response, next: NextFunction) => {
  const error: Error & { status?: number } & { message: String } = new Error();
  error.status = 404;
  error.message = "Page Not Found";
  next(error);
});

//Error handler middleware
app.use((error: any, req: Request, res: Response, next: NextFunction) => {
  res.status(error.status || 500).json({
    status: false,
    message: error.message,
  });
});
