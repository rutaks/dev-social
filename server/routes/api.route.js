import Router from "express";
import authRoute from "./api/auth.route";
import postRoute from "./api/post.route";
import profileRoute from "./api/profile.route";

const router = Router();

/**
 * Route handling authentication
 * @name /api/v1/auth
 * @function
 * @param {string} path - Express path
 * @access Public
 */
router.use("/auth", authRoute);
/**
 * Route handling posts
 * @name /api/v1/posts
 * @function
 * @param {string} path - Express path
 * @access Public
 */
router.use("/posts", postRoute);
/**
 * Route handling user profiles
 * @name /api/v1/profile
 * @function
 * @param {string} path - Express path
 * @access Public
 */
router.use("/profile", profileRoute);

export default router;
