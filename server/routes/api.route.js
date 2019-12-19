import Router from "express";
import authRoute from "./api/auth.route";
import postRoute from "./api/post.route";

const router = Router();

/**
 * Route handling authentication
 * @name /api/v1/auth
 * @function
 * @param {string} path - Express path
 * @access Public
 */
router.use("/auth", authRoute);
router.use("/posts", postRoute);

export default router;
