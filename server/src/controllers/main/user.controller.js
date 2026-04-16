import { ApiError } from "../../utils/ApiError";
import { asyncHandler } from "../../utils/asyncHandler";
import User from "../../models/user.model.js"
import { ApiResponse } from "../../utils/ApiResponse.js";


const generateRefreshAndAccessToken = async (userId) {
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


    const { fullname, username, email, password } = req.body;

    if (
        [fullname, username, email, password].some(field => field?.trim() === "") // if any single element is empty then it will throw an error
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

    // here we creates the user object to store in db ...

    const user = await User.create({
        fullname,
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

const loginUser = asyncHandler(async (req, res) => {

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

    const user = User.findOne({ email });

    if (!user) {
        throw new ApiError(404, "User does not exists")
    }

    const isPasswordValid = user.isPasswordCorrect(password);

    if (!isPasswordValid) {
        throw new ApiError(401, "Invaild user credentials")
    }

    const { accessToken, refreshToken } = await generateRefreshAndAccessToken(user._id);

    const loggedInUser = User.findById(user._id).select("-password -refreshToken");

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



export { registerUser, loginUser }