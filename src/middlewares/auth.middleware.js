//verifyJWT means we have to check refresh token of client request from cookie and refrehToken
//stored in db in user model

import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import  jwt  from "jsonwebtoken";
import {User} from "../models/user.model.js"



export const verifyJWT = asyncHandler(async(req,res,next) => {
    console.log("in verifyJWT");
    // const token = req.cookies?.accessToken || req.header("Autherisation").replace("Bearer ", "" );
    // if(!token){
    //     throw new ApiError(400 , "Unauthorised request");
    // }
    // const decodedToken = jwt.verify(token , process.env.ACCESS_TOKEN_SECRET);
    // const user = await User.findById(decodedToken._id);
    // if(user.refreshToken !== req.cookies?.refreshToken ){        
    //     throw new ApiError(500 ,  " Unauthorised request , refresh tokens not matched")
    // }
    // req.user = {
    //     _id : user._id
    // }
    // next()

})