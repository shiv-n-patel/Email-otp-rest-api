import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI || " ";

const connectDB = async () => {
    try{
        await mongoose.connect(MONGODB_URI,);
        
        
    } catch (error){
        console.log("dbConn - ", error);
    }
}

export default connectDB;