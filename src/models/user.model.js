import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
const userSchema = new mongoose.Schema({
    userName : {
        type : String,
        required : true,
        lowercase : true,
        trim : true,
        unique : true ,
        index : true 
    },
    email :  {
        type : String,
        required : true,
        lowercase : true,
        trim : true,
        unique : true 
    },
    fullName :  {
        type : String,
        required : true,
        trim : true,
        index : true 
    },
    avatar : {
        type : String,
        required : true 
    },
    coverImage : {
        type : String
    },
    password : {
        type : String,
        required : true
    },
    refreshToken : {
        type : String,

    },
    watchHistory  : [{
        type : mongoose.Schema.Types.ObjectId,
        ref : "Video "
    }]

},{timestamps : true})

userSchema.pre('save', async function() {
    if(this.isModified("password")){
    this.password = await bcrypt.hash(this.password);
    next();
    }
  });
  userSchema.methods.isPasswordCorrect = async function(password){
    return await bcrypt.compare(password,this.password)
  }

  userSchema.methods.generateAccessToken = function(){
    return jwt.sign(
       {
        _id :  this._id,
        emai : this.email,
        userName : this.userName,
        fullName : this.fullName
    },
    process.env.ACCESS_TOKEN_SECRET,
    {
        expiresIn : ACCESS_TOKEN_EXPIRY
    }
)
  }
export const User = mongoose.model("User",userSchema)