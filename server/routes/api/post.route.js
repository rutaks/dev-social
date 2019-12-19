import Router from "express";
import PostController from "../../controllers/post.controller";
import isLoggedIn from "../../middlewares/isLoggedIn";

const router = Router();

/**
 * Route handling account creation of a user {POST}
 * @name /api/v1/signup
 * @param {string} path - Express path
 */
router.post("/", isLoggedIn, PostController.save);

export default router;
