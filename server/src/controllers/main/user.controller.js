import { ApiError } from "../../utils/ApiError";
import { asyncHandler } from "../../utils/asyncHandler";
import User from "../../models/user.model.js"
import { ApiResponse } from "../../utils/ApiResponse.js";



const registerUser = asyncHandler(async (req, res) => {

    // ----- steps to perform to register a user -----

    /*
        1. get user details from frontend 
        2. validation - non empty 
        3. check if user already exists : username / password 
        4. check for images or avatars and upload them to cloudinary { optional }
        5. remove password and refresh token field from response 
        6. check for user creation 
        7. return response
    */


    const { fullname, username, email, password } = req.body;

    if (
        [fullname, username, email, password].some(field => field?.trim() === "") // if any single element is empty then it will throw an error
    ) {
        throw new ApiError(400, "All fields are required");
    }

    const existingUser = User.findOne({
        $or: [{username} , {email}]
    })

    if(existingUser){
        throw new ApiError(409 , "User with this email or username already exists")
    }

    // here we creates the user object to store in db ...

    const user = await User.create({
        fullname, 
        username : username.toLowerCase(), 
        password,
        email
    })

    // here we checks if the user object is created or not , if its created then remove password and refreshtoken field by using select method { its syntax is kind of wierd as it accepts a string in which we have to pass the fields we dont wants with "-" symbol , as all are selected by default } 

    const createdUser = await User.findById(user._id).select(
        "-password -refreshToken"
    )

    if(!createdUser){
        throw new ApiError(500 , "  something went wrong while registering the user")
    }

    return res.status(201).json(
        new ApiResponse(200 , createdUser , "user registered successfully ")
    )

})

export { registerUser }