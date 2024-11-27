import { Router } from "express";
const router = Router();
import { verifyJWT } from "../middlewares/auth.middleware.js";

import {upload} from "../middlewares/multer.middleware.js"
import {loginUser,logoutUser, registerUser} from "../controllers/user.controllers.js"

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
router.route("/logout").post(verifyJWT , logoutUser)

export default router;