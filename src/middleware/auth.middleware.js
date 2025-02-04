import {asynchhandler} from "../utils/asynchhandler.js"
import { ErrorHandler } from "../utils/ErrorHandler.js"
import jwt from "jsonwebtoken"
import { User } from "../models/user.model.js"
export const verifyjwt = asynchhandler(async(req,res,next)=>{
  try {
    const token = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ","")
  if (!token) {
    throw new ErrorHandler(401,"user is not authorized")

  }
 const decodedtoken = jwt.verify(token,process.env.ACCESS_TOKEN_SECRET )
//  console.log( "decodedtoken:",decodedtoken);
 
 const user = await User.findById(decodedtoken?._id).select("-password -refrshToken")
 if (!user) {
  throw new ErrorHandler(401,"Invalid access token")
 }
 req.user = user
 next()
  } catch (error) {
    throw new ErrorHandler(401,error?.message || "Invalid access token")
  }

})
