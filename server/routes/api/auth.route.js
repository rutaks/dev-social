import Router from "express";
import AuthController from "../../controllers/user.controller";

const router = Router();

/**
 * Route handling account creation of a user
 * @name /api/v1/signup
 * @function
 * @param {string} path - Express path
 */
router.post("/signup", AuthController.signup);
router.post("/signin", AuthController.login);

export default router;
