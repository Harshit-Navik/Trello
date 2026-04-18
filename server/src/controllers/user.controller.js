import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import User from "../models/user.model.js"
import { ApiResponse } from "../utils/ApiResponse.js";
import jwt from "jsonwebtoken";

const generateRefreshAndAccessToken = async (userId) => {
    try {
        const user = await User.findById(userId)

        const refreshToken = user.generateRefreshToken()
        const accessToken = user.generateAccessToken()

        user.refreshToken = refreshToken;
        await user.save({ validateBeforeSave: false }) //  as we are updatind a single field , so we dont needs full validation here , thats why we skip validation 

        return { accessToken, refreshToken }
    } catch (err) {
        throw new ApiError(500, "something went wrong while generating tokens")
    }
}


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


    const { fullName, username, email, password } = req.body;

    if (
        [fullName, username, email, password].some(field => field?.trim() === "") // if any single element is empty then it will throw an error
    ) {
        throw new ApiError(400, "All fields are required");
    }

    // here we check if the user already exists 

    const existingUser = await User.findOne({
        $or: [{ username }, { email }]
    })

    if (existingUser) {
        throw new ApiError(409, "User with this email or username already exists")
    }

    // doing this will create an user object and save to mongo , and return a full mongoose document that include "_id" that we have used in next step


    const user = await User.create({
        fullName,
        username: username.toLowerCase(),
        password,
        email
    })

    // here we are fetching the user from db using userId , then removing password and refreshtoken field by using select method { its syntax is kind of wierd as it accepts a string in which we have to pass the fields we dont wants with "-" symbol , as all are selected by default } 
    // why are we removing senstive credentials , as its not safe to send back user data with these credentials 

    const createdUser = await User.findById(user._id).select(
        "-password -refreshToken"
    )

    if (!createdUser) {
        throw new ApiError(500, "  something went wrong while registering the user")
    }

    return res.status(201).json(
        new ApiResponse(200, createdUser, "user registered successfully ")
    )

})

const logInUser = asyncHandler(async (req, res) => {

    // ------------ steps to follow to login a user --------------------
    /* 
    1. get data from frontend { e.g. email , username , password } [ ill go with email and password only ]
    2. validate them { means check wheather the given data is valid or its empty , and the format of data is correct or not }
    3. now find the user in db 
    4. if the user doesnt exists then throw error , and if it does then compare the password 
    5. after comparision , generate access and refresh token 
    6. send them in cookies and then send response 
    */

    const { email, password } = req.body;

    if (!email || !password) {
        throw new ApiError(400, "email and password is required")
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        throw new ApiError(400, "Invalid email format");
    }

    if (password.length < 6) {
        throw new ApiError(400, "Password must be at least 6 characters");
    }

    // find user in database 

    const user = await User.findOne({ email });

    if (!user) {
        throw new ApiError(404, "User does not exists")
    }

    const isPasswordValid = await user.isPasswordCorrect(password);

    if (!isPasswordValid) {
        throw new ApiError(401, "Invaild user credentials")
    }

    const { accessToken, refreshToken } = await generateRefreshAndAccessToken(user._id);

    const loggedInUser = await User.findById(user._id).select("-password -refreshToken");

    const options = {
        httpOnly: true,
        secure: true
    }

    return res
        .status(200)
        .cookie("accessToken", accessToken, options)
        .cookie("refreshToken", refreshToken, options)
        .json(
            new ApiResponse(
                200,
                {
                    user: loggedInUser,
                    accessToken,
                    refreshToken
                },
                "user logged in successfully"
            )
        )
})

// answer them when revisit 

/* 
1. how removing refresh token helps to log out user 
2. why to define options here
3. what is this clearcookie in response
*/

// ye part thoda km smj aaya , will revisit later

// to logout a user , we just have to remove their access and refresh token , that what we did in logoutuser controller 


const logOutUser = asyncHandler(async (req, res) => {
    await User.findByIdAndUpdate(
        req.user._id,
        {
            $set: {
                refreshToken: undefined  // to set the refresh token undefined 
            }
        },
        {
            new: true  // to return the new updated response 
        }
    )

    const options = {
        httpOnly: true,
        secure: true
    }

    return res
        .status(200)
        .clearCookie("accessToken", options)
        .clearCookie("refreshToken", options)
        .json(
            new ApiResponse(200, {}, "User logged out")
        )
})


const refreshAccessToken = async (req, res) => {
    const incomingRefreshToken = req.cookie.refreshToken || req.body.refreshToken;

    if (!incomingRefreshToken) {
        throw new ApiError(401, "Unauthorized request")
    }

    try {
        const decodedToken = jwt.verify(incomingRefreshToken, process.env.REFRESH_TOKEN_SECRET);

        const user = User.findById(decodedToken?._id)

        if (!user) {
            throw new ApiError(401, "Invalid Refresh Token")
        }

        if (decodedToken !== user?.refreshToken) {
            throw new ApiError(401, "Refresh token is expired or used")
        }

        const options = {
            httpOnly: true,
            secure: true,
            sameSite: "Strict"
        }

        const { accessToken, newRefreshToken } = await generateRefreshAndAccessToken(user._id);

        user.refreshToken = newRefreshToken;
        await user.save({ validateBeforeSave: false });

        return res
            .status(200)
            .cookie("accessToken", accessToken)
            .cookie("refreshToken", newRefreshToken)
            .json(
                new ApiResponse(
                    200,
                    {},  // removed access and refresh token from response as we have already saved them on cookie 
                    "Access Token Refreshed"
                )
            )
    } catch (error) {
        throw new ApiError(401, error?.message || "Invaild Refresh Token")
    }
}

export { registerUser, logInUser, logOutUser, refreshAccessToken }