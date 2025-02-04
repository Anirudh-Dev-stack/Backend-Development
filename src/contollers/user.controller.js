import { asynchhandler } from '../utils/asynchhandler.js'
import { ErrorHandler } from '../utils/ErrorHandler.js'
import { User } from '../models/user.model.js'
import { uploadfile } from '../utils/cloudinary.js'
import { ApiResponse } from '../utils/ApiResponse.js'
import jwt from "jsonwebtoken"

const generaterefreshandaccestoken = async (userId) => {
    try {
        const user = await User.findById(userId)
        const accessToken = user.getACcesstoken()
        const refreshToken = user.getRefreshtoken()
        console.log(refreshToken);
        
        user.refreshToken = refreshToken
         await user.save({validateBeforeSave:true})
         return {
            refreshToken,accessToken
         }
    } catch (error) {
        throw new ErrorHandler(500,"something went wrong while generating access and  refresh token ")
    }
    
}

 const registeruser = asynchhandler(async (req, res) => {

    const { email, fullname, username, password } = req.body
    console.log("email:", email);
    console.log("the request is sending", req.body);

    if ([email, fullname, username, password].some((field) =>
        field?.trim() === "")) {
        throw new ErrorHandler(400, "All fields are required")

    }
    const existedUsedr = await User.findOne({
        $or: [{ username }, { email }]
    })
    if (existedUsedr) {
        throw new ErrorHandler(409, "User with email already exists")
    }
    const avatarlocalpath = req.files?.avatar[0]?.path;
    let coverImagelocalpath;
    if (req.files && Array.isArray(req.files.coverImage) && req.files.coverImage.length > 0) {
        coverImagelocalpath = req.files.coverImage[0].path
    }



    if (!avatarlocalpath) {
        throw new ErrorHandler(400, "Avatar file is required")
    }

    const avatar = await uploadfile(avatarlocalpath)
    const coverImage = await uploadfile(coverImagelocalpath)
    const user = await User.create({
        fullname,
        avatar: avatar.url,
        coverImage: coverImage?.url || "",
        email,
        password,
        username: username.toLowerCase()

    })
    const finduser = await User.findById(user._id).select(
        "-password -refreshToken"
    )
    if (!finduser) {
        throw new ErrorHandler(500, "something went wrong while creating user")
    }
    return res.status(201).json(
        new ApiResponse(200, finduser, "User registered successfully")
    )

})
const loginuser = asynchhandler(async (req,res)=>{
    const {username,password,email} = req.body
    if (!(username || email)) {
        throw new ErrorHandler(400,"username or email required")
    }
     const user =await User.findOne({
        $or :[{username},{email}]
    })
    if (!user) {
        throw new ErrorHandler(404,"user does not exist")
    }
    const passwordchecking = await user.isPasswordCorrect(password)
    if (!passwordchecking) {
        throw new ErrorHandler(401,"wrong password")
    }
     const {refreshToken,accessToken} = await generaterefreshandaccestoken(user._id)
     const loggedinuser = await  User.findById(user._id)
     const options = {
        httpOnly:true,
        secure:true
     }
     return res
     .status(200)
     .cookie("accessToken",accessToken,options)
     .cookie("refreshToken",refreshToken,options)
     .json(
        new ApiResponse(
            200,
            {
                user:loggedinuser,refreshToken,accessToken
            },
            "user logged in successfully"
        )
     )

})
 const logout = asynchhandler(async (req,res)=>{
    await User.findByIdAndUpdate(
        req.user._id,
        {
            $unset:{
                refreshToken:1
            }
        },
        {
            new:true
        }
    
    )
    const options = {
        httpOnly:true,
        secure:true
     }
     return res
     .status(200)
     .clearCookie("accessToken",options)
     .clearCookie("refreshToken",options)
     .json(
        new ApiResponse(
            200,
            {},
            "user logged out successfully"
        )
     )

    
})
const refreshaccesstoken = asynchhandler(async(req,res)=>{
try {
    const incomingrefreshtoken = req.cookies.refreshToken || req.body.refreshToken
if (!incomingrefreshtoken) {
    throw new ErrorHandler(400,"invalid refresh token")
}
const decodedToken =  jwt.verify
(incomingrefreshtoken,
process.env.REFRESH_TOKEN_SECRET)
const user = await User.findById(decodedToken._id)
if (!user) {
    throw new ErrorHandler(401,"invalid refresh token")
}
if (incomingrefreshtoken !== user?.refreshToken) {
    throw new ErrorHandler(401,"invalid refresh token")
}
const options = {
   httpOnly:true,
   secure:true
}
const {accessToken,newrefreshToken}=await generaterefreshandaccestoken(user._id)
return res.status(200)
.cookie("accestoken",accessToken,options)
.cookie("refreshToken",newrefreshToken,options)
.json(
    new ApiResponse(
        200,
        {
            accessToken,refreshToken:newrefreshToken

        },
        "refresh token refreshed"
    )
)
} catch (error) {
    throw new ErrorHandler(201,error?.messqge || "invalid refresh token")
}
})
const changepassword = asynchhandler(async (req,res)=>{
    const {oldpassword,newpassword} = req.body
    const user =await User.findById(req.user?._id)
    const passwordcheck = await user.isPasswordCorrect (oldpassword)
    if (!passwordcheck) {
        throw new ErrorHandler(401,"Invalid password")
        
    }
    user.password=newpassword
    return res.
    status(200)
    .json(
        new ApiResponse(
            200,
            {},
            "your password has been changed successsfully"
        )
    )
})
const currentuser = asynchhandler(async(req,res)=>{
    return res.
    status(200).json(
        new ApiResponse(200,
            req.user,
            " current user fetched sucessfully"
        )
    )
   
})
const changeaccount = asynchhandler(async (req,res)=>{
         const {email,fullname} = req.body
         if (!fullname || !email) {
            throw new ErrorHandler(400,"fullname or email is required")
            
         }
       const user = await User.findByIdAndDelete(
            req.user?._id,
            {
                $set:{
                    fullname,
                    email
                }
            },
            {new:true}
        ).select("-password")

        return res
        .status(200)
        .json(
            new ApiResponse(200,user,"your account details has been changed successfully")

        )
})
const changeAvatar = asynchhandler(async (req,res)=>{
    const avatarlocal = req.file?.path
    if (!avatarlocal) {
        throw new ErrorHandler(400,"Avatar file does not exists")
        
    }
   const avatar = await uploadfile(avatarlocal)
   if (!avatar.url) {
    throw new ErrorHandler(400,"Error occured while uploading on cloudinary")
   }
  const user = await User.findByIdAndUpdate(
    req.user?._id,
    {
        $set:{avatar:avatar.url}
    },
    {new:true}
   ).select("-password")
   return res
   .status(200)
.json(
    new ApiResponse(200,user,"your avatar has been changed successfully")
)
    
})
const changecoverImage = asynchhandler(async(req,res)=>{
    const coverImagelocal = req.file?.path
    if (!coverImagelocal) {
        throw new ErrorHandler(400,"coverImage file does not exists")
        
    }
   const coverImage= await uploadfile(coverImagelocal)
   if (!coverImage.url) {
    throw new ErrorHandler(400,"Error occured while uploading on cloudinary")
   }
  const user = await User.findByIdAndUpdate(
    req.user?._id,
    {
        $set:{coverImage:coverImage.url}
    },
    {new:true}
   ).select("-password")
   return res
   .status(200)
.json(
    new ApiResponse(200,user,"your coverImage has been changed successfully")
)
})


export {registeruser,loginuser,logout,refreshaccesstoken,changepassword,changeaccount,changeAvatar,changecoverImage.cxvv}

