import app from "./app";
import express from "express";
import dotenv from "dotenv";
import cors from "cors";

dotenv.config();

app.use(cors({
  origin: "*",
  credentials: true
}));

app.use(express.json());

const PORT = process.env.PORT || 8000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

export default app;