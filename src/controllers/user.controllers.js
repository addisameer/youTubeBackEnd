import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from  "../utils/ApiError.js";


import { ApiResponse } from  "../utils/ApiResponse.js";
import {User} from "../models/user.model.js";
import {uploadOnCloudinary} from "../utils/cloudinary.js"

const generateAccessAndRefreshTokens = async(userId) => {
    try {
        const user = await User.findById(userId);
        const accessToken = await user.generateAccessToken()
        const refreshToken = await user.generateRefreshToken()
        user.refreshToken = refreshToken;
        await user.save();
        return {accessToken ,refreshToken}
    } catch (error) {
        throw new ApiError(500 , "something went wrong while genrating access and refresh tokens")
        
    }
}
const registerUser = asyncHandler(async(req,res) => {
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
const loginUser = asyncHandler(async(req,res) => {
    // todo's for login user . 
    // take email or username and password from user  . 
    //apply validation - not registered and wrong password 
    //generate access and refresh token
    // send access and refresh token to frontend by cookies
    //store refresh token in database 
    //send successful login response to frontend.

    const {email , userName , password } = req.body;
    if(!(email || userName) || !password){
        throw new ApiError(400  , "Please fill all the required field.")
    }

    const user =  await User.findOne({
        $or : [{email} , {userName}]
    })
    if(!user){
        throw new ApiError(400 , "User is not registered.")
    }
    if(!await user.isPasswordCorrect(password)){
        throw new ApiError(400 , "Enter valid password . ")
     }
    const {accessToken , refreshToken} = await generateAccessAndRefreshTokens(user._id);
    const loggedInUser = await User.findById(user._id).select("-password -refreshToken")
    const options = {
        httpOnly : true,
        secure : true 
    }

    res
    .status(200)
    .cookie("accessToken",accessToken,options)
    .cookie("refreshToken",refreshToken,options)
    .json(new ApiResponse(200 , {
        user : loggedInUser ,  accessToken ,  refreshToken
    } ,   "logged In successfully"))
  //problem is that i dont add access and refresh token in user object while sending response.

})
const logoutUser = asyncHandler(async(req,res)  => {
    //todees for logout
    //delete refresh tokern from db
    //clear cookies for that logged in user 
    //reference of logged In user is in req.user object from verifyJWT middleware .

    // console.log(req.user);
    const user = await User.findById(req.user._id);
    user.refreshToken = undefined;
    await user.save();
    res.clearCookie("accessToken")
    res.clearCookie("refreshToken")

    const options = {
        httpOnly : true,
        secure : true 
    }

    res.status(200).json(new ApiResponse(200 ,{},  "Logged out"));
})
const refreshAccessToken = asyncHandler(async(req,res) => {
    const incomingRefreshToken = req.cookie?.refreshToken || req.body().refreshToken ;
    if(!incomingRefreshToken){
        throw new ApiError(400 , " do not have refresh token to refresh access token .  .");
    }
   try {
     const decodedRefreshToken  = await jwt.verify(incomingRefreshToken,process.env.REFRESH_TOKEN_SECRET);
     const user = await User.findById(decodedRefreshToken?._id);
     if(!user){
        throw new ApiError(400 , "Not a valid refresh Token" );
     }
     if(incomingRefreshToken !== user.refreshToken){
         throw new ApiError(400 , " refresh Tokens not matched .");
     }
     const {accessToken , refreshToken } = await generateAccessAndRefreshTokens(user._id);
     const loggedInUser = await User.findById(user._id).select("-password -refreshToken")
     const options = {
         httpOnly : true,
         secure : true 
     }
 
     res
     .status(200)
     .cookie("accessToken",accessToken,options)
     .cookie("refreshToken",refreshToken,options)
     .json(new ApiResponse(200 , {
         user : loggedInUser ,  accessToken ,  refreshToken
     } ,   "Access token refreshed ."))
   } catch (error) {
    throw new ApiError(500 , "Something went wrong while refreshing access Token .")
   }

})
export {
    registerUser, 
    loginUser,
    logoutUser,
    refreshAccessToken,
} 