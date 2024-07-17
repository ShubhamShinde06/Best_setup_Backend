import {v2 as cloudinary} from "cloudinary"//10.1
import fs from "fs"//10.2

// Configuration
cloudinary.config({ 
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
    api_key: process.env.CLOUDINARY_API_KEY, 
    api_secret: process.env.CLOUDINARY_API_SECRET, // Click 'View Credentials' below to copy your API secret
});//10.3

const uploadCloudinary = async (localFilePath) => {
    try{
        if(!localFilePath) return null
        //upload the file 
        const res = await cloudinary.uploader.upload(localFilePath,{
            resource_type: "auto"
        })
        //file has been uploaded successfull
        // console.log("file is uploaded on cloudinary",
        // res.url);
        fs.unlinkSync(localFilePath)
        return res;

    } catch (err) {
        fs.unlinkSync(localFilePath) //remove the locally saved temporary file as the upload operation got failed
    }
}

export {uploadCloudinary}//10.4