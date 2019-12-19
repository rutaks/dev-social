import Router from "express";
import AuthController from "../../controllers/user.controller";

const router = Router();

/**
 * Route handling account creation of a user {POST}
 * @name /api/v1/signup
 * @param {string} path - Express path
 */
router.post("/signup", AuthController.signup);
/**
 * Route handling user authentication & Token Acquisition {POST}
 * @name /api/v1/signin
 * @access Public
 */
router.post("/signin", AuthController.login);

export default router;
