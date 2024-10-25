import * as dotenv from "dotenv";
dotenv.config();
import { Request, Response } from "express";
const jwt = require("jsonwebtoken");

export const getUserProfile = async (req: Request, res: Response) => {
  try {
    const authHeader = req.headers["authorization"];

    if (authHeader) {
      const [scheme, token] = authHeader.split(" ");

      if (scheme === "Bearer" && token) {
        try {
          const decodedToken = jwt.verify(token, process.env.JWT_SECRET);

          console.log("decoded token ==>> ", decodedToken);
        } catch (err) {
          return res.status(401).json({
            success: false,
            message: "Invalid token",
          });
        }
      }
    }
  } catch (error) {
    if (error instanceof Error) {
      return res.status(500).json({
        success: false,
        message: "Internal Server Error",
        error: error?.message,
      });
    }
  }
};
