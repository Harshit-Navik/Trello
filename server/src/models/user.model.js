import mongoose from "mongoose";

const userSchema = new mongoose.Schema({ 

    userName: {
        type: String, 
        required: true,
    },

    email: {
        type: String,
        required: true,
        lowercase: true,
        unique: true,
        trim: true
    },

    password: {
        type: String,
        required: [true , "password is required"],
        minlength: [6, "password must have atleast 6 letters"],
        maxlength: 12,
    }

} , { timestamps : true })


export const User = mongoose.model("User" , userSchema);