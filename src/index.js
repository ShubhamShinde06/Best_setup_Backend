import dotenv from "dotenv" //3.1
import connectDB from "./db/index.js"; //3.2

dotenv.config({
    path: './env' //3.3
})

connectDB() //3.4

.then(() => {

    app.on("error",(error) => {
        console.log("ERRR:",error);
        throw error//4.4
    })

    app.listen(process.env.PORT || 8000, ()=> {
        console.log(`server is running at port : ${process.env.PORT}`)
    });//4.3
})
.catch((err) => {
    console.log("MONGO DB connection failed !",err);//4.5
})


