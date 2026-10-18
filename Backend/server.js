import express from "express";
import app from "./app.js";
import { connectDB } from "./src/config/db.js";
import { configDotenv } from "dotenv";


configDotenv()
const PORT = 3001





connectDB()



app.listen(PORT, () => {
    console.log(`Server listen at http://localhost:${PORT}`);
})







