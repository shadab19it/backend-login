require("dotenv").config();
import express, { Request, Response, Application } from "express";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import cors from "cors";
// Routes Import
import authRoutes from "./route/auth";

const app: Application = express();
// my data base
mongoose
  .connect("mongodb://localhost/login_page", { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log("DB connected sussesfully");
  })
  .catch((err) => console.log(err));

// Middleware
app.use(bodyParser.json());
app.use(express.json());
app.use(cors());

// Routes use
app.get("/", (req: Request, res: Response) => {
  res.send("hello word");
});

app.use("/api", authRoutes);

const port: number = 5000;
app.listen(port, () => {
  console.log(`Server start with port ${port}`);
});
