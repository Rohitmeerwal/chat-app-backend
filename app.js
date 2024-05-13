import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
dotenv.config();
import cors from "cors"
import authRoutes from "./routes/auth.routes.js";
import messageRoutes from "./routes/message.routes.js";
import userRouter from "./routes/user.routes.js"
import connectDB from "./config/connectDB.js";
import { app, server } from "./socket/socket.js";


// const app = express();
const port = process.env.PORT || 8000;

const DATABASEURL = process.env.MONGODB_URL;
connectDB(DATABASEURL);
app.use(cors(
  {
    origin:"https://chat-app-i08f.onrender.com",
    // origin:"http://localhost:3001",
    preflightContinue:true,
    credentials:true
  }
))
app.use(express.json());
app.use(cookieParser());
app.use("/api/users", authRoutes);
app.use("/api/messages", messageRoutes);
app.use("/api/user", userRouter)

server.listen(port, () => {
  console.log(`server listening on ${port}`);
});
