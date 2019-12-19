import Router from "express";
import authRoute from "./api/auth.route";

const router = Router();

/**
 * Route handling authentication
 * @name /api/v1/auth
 * @function
 * @param {string} path - Express path
 */
router.use("/auth", authRoute);

export default router;
