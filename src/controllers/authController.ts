import * as dotenv from "dotenv";
dotenv.config();
import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

export const signup = async (req: Request, res: Response) => {
  try {
    const { email, password, name, phoneNumber, address } = req.body;

    const sanitizedEmail = email?.trim();
    const sanitizedPassword = password?.trim();
    const sanitizedName = name?.trim();

    if (!sanitizedEmail || !sanitizedPassword || !sanitizedName) {
      return res.status(400).json({
        success: false,
        message: "Fields cannot be empty",
      });
    }

    const existingUser = await prisma.user.findUnique({
      where: { email: sanitizedEmail },
    });

    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "User already exists",
      });
    }

    const hashedPassword = await bcrypt.hash(sanitizedPassword, 10);

    const newUser = await prisma.user.create({
      data: {
        email: sanitizedEmail,
        password: hashedPassword,
        name: sanitizedName,
        phoneNumber: phoneNumber,
        address: address,
      },
    });

    const userToken = jwt.sign(
      { id: newUser?.id, email: newUser?.email },
      process.env.JWT_SECRET,
      {
        expiresIn: "48h",
      }
    );

    return res.status(201).json({
      success: true,
      message: "User signed up successfully",
      data: newUser,
      user_token: userToken,
    });
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

export const signin = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    const sanitizedEmail = email?.trim();
    const sanitizedPassword = password?.trim();

    if (!sanitizedEmail || !sanitizedPassword) {
      return res.status(400).json({
        success: false,
        message: "Fields cannot be empty",
      });
    }

    const existingUser = await prisma.user.findUnique({
      where: { email: sanitizedEmail },
    });

    if (!existingUser) {
      return res.status(400).json({
        success: false,
        message: "User does not exist",
      });
    }

    console.log("existing user ==>> ", existingUser);

    const isPasswordValid = await bcrypt.compare(
      sanitizedPassword,
      existingUser?.password
    );

    console.log("isPasswordValid ==>> ", isPasswordValid);

    if (!isPasswordValid) {
      return res.status(400).json({
        success: false,
        message: "Invalid password",
      });
    }

    const userToken = jwt.sign(
      { id: existingUser?.id, email: existingUser?.email },
      process.env.JWT_SECRET,
      {
        expiresIn: "48h",
      }
    );

    return res.status(200).json({
      success: true,
      message: "User signed in successfully",
      data: existingUser,
      user_token: userToken,
    });
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
