import { v2 as cloudinary } from 'cloudinary'
import fs from 'fs'

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET
})

const uploadfile = async (filepath) => {
  try {
    if(!filepath) return null
    const response =await cloudinary.uploader.upload(filepath,{
      resource_type:'auto'
    })
    fs.unlinkSync(filepath)
    // console.log(response);
    
    // console.log("your file has been uploaded on cloudinary",response.url);
    return response

  } catch (error) {
    fs.unlinkSync(filepath)
    return null

  }
}
export {uploadfile}

