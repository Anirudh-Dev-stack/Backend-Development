

const asynchhandler =  (handleprovider)=>{
return (req,res,next)=>{
    Promise.resolve(handleprovider(req,res,next)).catch((err)=>next(err))
}
}
export {asynchhandler}

















// Another way to execute the code 

// const asynchhandler = (fn) => async (req, res, next) => {
//     try {
//         await fn(req, res, next)
//     } catch (error) {
//         res.status(error.code || 500).json({
//             success: false,
//             message: error.message || "Internal servar error"
//         })
//     }
// }