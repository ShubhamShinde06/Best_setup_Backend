import mongoose from "mongoose";//2.1
import {DB_NAME} from '../constants.js';//2.2

const connectDB = async () => {
    try {
        const connectInstance = await mongoose.connect //2.3
        (`${process.env.MONGODB_URL}/${DB_NAME}`) //2.4
        console.log(`\n MonoDB connected !! DB HOST: ${connectInstance.connection.host}`) //2.5
    } catch (error) {
        console.log("Error",error); //2.6
        process.exit(1); //2.7
    }
}

export default connectDB;