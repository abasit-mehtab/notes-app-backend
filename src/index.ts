import * as dotenv from "dotenv";
dotenv.config();
const bodyParser = require("body-parser");
import authRoutes from "./routes/authRoutes";
import userRoutes from "./routes/userRoutes";
import noteRoutes from "./routes/noteRoutes";
import express, { Request, Response } from "express";

const PORT = process.env.PORT || 3001;

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", (req: Request, res: Response) => {
  res.status(200).json({
    message: "Welcome to Notes App APIs!",
  });
});

app.use("/api", authRoutes);
app.use("/api", userRoutes);
app.use("/api", noteRoutes);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
