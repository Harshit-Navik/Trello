// asyncHandler is a higher-order function that wraps Express route handlers in Promise.resolve(), so any error thrown inside an async function is automatically caught and forwarded to Express's error-handling middleware via next(err) — eliminating the need for repetitive try/catch blocks in every route.


const asyncHandler = (requestHandler) => {
    return (req, res, next) => {
        return Promise.resolve(requestHandler(req, res, next)).catch((err) => {
            next(err);
        })
    }
}


// currently using this one , as this feels easy now ......  


// const asyncHandler = (funct) => async (req , res , next) => {
//     try{c
//         await funct(req , res , next);
//     }catch (err) {
//         res.status( err.statusCode || 500).json({
//             success: false,
//             message: err.message || "internal server error"
//         })
//     }
// }

export { asyncHandler };