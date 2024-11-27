import { Router } from "express";
const router = Router();
import { verifyJWT } from "../middlewares/auth.middleware.js";

import {upload} from "../middlewares/multer.middleware.js"
import {loginUser,logoutUser, registerUser, refreshAccessToken } from "../controllers/user.controllers.js"

router.route("/register").post(upload.fields([
    {
        name : "avatar",
        maxCount : 1

    },
    {
        name : "coverImage",
        maxCount : 1

    }
]),registerUser);
router.route("/login").post(loginUser)

//secured routes
router.route("/logout").post(verifyJWT , logoutUser);
router.route("/refresh-token").post(refreshAccessToken);


export default router;