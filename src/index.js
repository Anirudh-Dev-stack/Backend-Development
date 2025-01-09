import dotenv from "dotenv"
import Connect_DB from "./db/index.js"

dotenv.config({
    path:'./env'
})


Connect_DB()

/*
let app = express()
(async ()=>{

    try {
       await mongoose.connect(`${process.env.MONGDB_URL}/${DB_NAME}`)
       app.on("error",()=>{
        console.log("ERROR: ",error);
        throw error
       })
       app.listen(process.env.PORT,()=>{
        console.log(`tour app listening on port ${process.env.PORT}`);
        
       })
        
    } catch (error) {
        console.error("ERROR: ",error)
        throw error
    }
})()*/