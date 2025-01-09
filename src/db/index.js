import mongoose from "mongoose";
 import { DB_NAME } from "../constants.js";

 const  Connect_DB = async ()=>{
    try {
       const connectionInstance = await mongoose.connect(`${process.env.MONGDB_URL}/${DB_NAME}`)
       console.log(`/n MONGODB CONNECTED !! DB HOST : ${connectionInstance.connection.host} `);
       
        
    } catch (error) {
        console.log("ERROR: ",error);
      process.exit(1)
        
    }
 }

 export default Connect_DB