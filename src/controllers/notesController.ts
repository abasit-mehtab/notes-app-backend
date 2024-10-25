import { Request, Response } from "express";
const jwt = require("jsonwebtoken");
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const addNote = async (req: Request, res: Response) => {
  try {
    const { title, content } = req.body;

    const sanitizedTitle = title?.trim();
    const sanitizedContent = content?.trim();

    const authHeader = req.headers["authorization"];

    if (authHeader) {
      const [scheme, token] = authHeader.split(" ");

      if (scheme === "Bearer" && token) {
        try {
          const decodedToken = jwt.verify(token, process.env.JWT_SECRET);

          const { id } = decodedToken;

          if (!sanitizedContent) {
            return res.status(400).json({
              success: false,
              message: "Please enter some content first",
            });
          }

          const newNote = await prisma.note.create({
            data: {
              title: sanitizedTitle,
              content: sanitizedContent,
              userId: id,
            },
          });

          return res.status(201).json({
            success: true,
            message: "Note created successfully",
            data: newNote,
          });
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

export const getAllUserNotes = async (req: Request, res: Response) => {
  try {
    const authHeader = req.headers["authorization"];

    if (authHeader) {
      const [scheme, token] = authHeader.split(" ");

      if (scheme === "Bearer" && token) {
        try {
          const decodedToken = jwt.verify(token, process.env.JWT_SECRET);

          const { id } = decodedToken;

          const userNotes = await prisma.note.findMany({
            where: {
              userId: id,
            },
          });

          return res.status(200).json({
            success: true,
            data: userNotes,
          });
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
