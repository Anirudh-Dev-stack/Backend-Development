import { Router } from "express";
import { registeruser,loginuser,logout,refreshaccesstoken } from "../contollers/user.controller.js";
import {upload} from "../middleware/multer.middleware.js"
import {verifyjwt} from "../middleware/auth.middleware.js"
const router = Router();
router.route("/register").post(
    upload.fields([
    {
        name:"avatar",
        maxCount:1
    },
    {
        name:"coverImage",
        maxCount:1
    }
]),
registeruser
)
router.route("/login").post(loginuser)
// secure routes
router.route("/logout").post(verifyjwt,logout)
router.route("/refresh-token").post(refreshaccesstoken)
export default router
