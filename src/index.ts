const express = require("express");
const bodyParser = require("body-parser");
const authRoutes = require("./routes/authRoutes");
import { Request, Response } from "express";

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", (req: Request, res: Response) => {
  res.status(200).json({
    message: "Welcome to Notes App APIs!",
  });
});

app.use("/api", authRoutes);

app.listen(3001, () => {
  console.log("Server is running on port 3001");
});
