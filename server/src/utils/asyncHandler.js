// const asyncHandler = async (requestHandler) => {
//     (req , res , next) => {
//         Promise.resolve(requestHandler(req , res , next)).catch((err) => {
//             next(err);
//         })
//     }
// }


// currently using this one , as this feels easy now ......  


const asyncHandler = (funct) => async (req , res , next) => {
    try{
        await funct(req , res , next);
    }catch (err) {
        res.status( err.statusCode || 500).json({
            success: false,
            message: err.message || "internal server error"
        })
    }
}

export { asyncHandler };