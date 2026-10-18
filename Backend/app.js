import express from "express";
import cors from "cors"
import AuthRoutes from "./src/routes/authRoutes.js";
import cookieParser from "cookie-parser"

const app = express()

app.use(cookieParser());
app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true
}))
app.use(express.json())
app.use("/api/auth", AuthRoutes)
app.get("/", (req, res) => {
    res.json({
        message: "Server Started"
    })
})


export default app



