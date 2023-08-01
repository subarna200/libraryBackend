import { NextFunction, Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import jwt from "jsonwebtoken";
import "dotenv/config";
const prisma = new PrismaClient();
export const AuthenticateUser = async (
  req: any,
  res: Response,
  next: NextFunction
) => {
  try {
    if (req.headers && req.headers.authorization?.startsWith("Bearer ")) {
      const jwtToken = req.headers.authorization.split(" ")[1];
      const user: any = jwt.verify(jwtToken, process.env.JWT_SECRET_KEY ?? "");
      const { Email, Role } = user;
      let isUserValid;
      if (Role === "admin") {
        isUserValid = await prisma.user.findUnique({
          where: {
            Email,
          },
        });
      } else {
        isUserValid = await prisma.students.findUnique({
          where: {
            Email,
          },
        });
      }
      if (isUserValid) {
        req.user = isUserValid;
        next();
      } else {
        res.status(401).json({
          status: false,
          message: "Unauthorized User",
        });
      }
    } else {
      res.status(400).json({
        status: false,
        message: "Authorization Failed",
      });
    }
  } catch (error: any) {
    res.status(500).json({
      status: false,
      message: error.message,
    });
  }
};
