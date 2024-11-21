import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from  "../utils/ApiError.js";

import { ApiResponse } from  "../utils/ApiResponse.js";
import {User} from "../models/user.model.js";
import {uploadOnCloudinary} from "../utils/cloudinary.js"

//  registerUser controller logic
// get user details from frontend
// validation - not empty
// check if user already exist - email, username 
// check for images, check for avatar
// upload them to clodinary , avatar 
// create user object , create entry in db 
// remove password and refreshToken field from response          
// check for user creation 
// return res 

const registerUser = asyncHandler(async(req,res) => {
    const {userName , email , fullName ,  password } = req.body;
    if(!(userName&&email&&fullName&&password)){
        throw new ApiError(400,"Please fill all the required field")
    }
    const existedUser = await User.findOne({email})
    if(existedUser){
      throw new ApiError(400 , "user has already registered.")
    }
    const avatarLocalPath = req.files?.avatar[0]?.path;
    let coverImageLocalPath ;
    if(req.files && Array.isArray(req.files.coverImage) &&req.files.coverImage.length> 0 ){
        coverImageLocalPath = req.files.coverImage[0].path;
    }
    if(!avatarLocalPath){
        throw new ApiError(400, "please upload avatar fil properly")
    }
    const avatar = await uploadOnCloudinary(avatarLocalPath);
    const coverImage = await uploadOnCloudinary(coverImageLocalPath);
    if(!avatar.url){
        throw new ApiError(400,"Avatar is not uploaded on clodinary.")
    }
    const user = await User.create({
        userName,
        email,
        fullName,
        avatar : avatar.url,
        coverImage : coverImage?.url || "",
        password
    })  
    const createdUser = await User.findById(user._id).select("-password -refreshToken");
    if(!createdUser){
        throw new ApiError(400,"User has not been created yet .")
    }
    res.status(201).json(
        new ApiResponse(200 , createdUser , "user has been registered successfully .")
    )
})
export {registerUser}










































































































