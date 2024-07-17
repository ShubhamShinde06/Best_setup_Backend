import express from "express";//4.1
import cors from "cors";//5.1
import cookieParser from "cookie-parser";//5.2

export const app = express();//4.2

app.use(cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true
}))//5.3

app.use(express.json({limit:"20kb"}))//6.1
app.use(express.urlencoded({extended: true,limit:"20kb"}))//6.2
app.use(express.static("public"))//6.3
app.use(cookieParser())//6.4

//routes import
import userRouter from './routes/user.routes.js';//14.1


//route declaration
app.use("/api/v1/users", userRouter)//14.2


