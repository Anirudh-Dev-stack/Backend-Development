import dotenv from "dotenv"
import Connect_DB from "./db/index.js"
import { app } from "./app.js"


dotenv.config({
    path:'./env'
})


Connect_DB()
.then(()=>{
    app.on("Error",(error)=>{
        console.log(error);
        throw error
        
    }
    )
  app.listen(process.env.PORT || 8000 , ()=>{
    console.log(`Your app listening on : ${process.env.PORT}`);
    
  })
})
.catch((Error)=>{
    console.log(`MONGODB connection failed `,Error);
    
})

/*
let app = express()
(async ()=>{

    try {
       await mongoose.connect(`${process.env.MONGDB_URL}/${DB_NAME}`)
       app.on("error",(error)=>{
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