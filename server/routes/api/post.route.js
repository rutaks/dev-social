import Router from "express";
import PostController from "../../controllers/post.controller";
import isLoggedIn from "../../middlewares/isLoggedIn";

const router = Router();

/**
 * Route handling post creation of a user {POST}
 * @name /api/v1/posts
 * @param {string} path - Express path
 */
router.post("/", isLoggedIn, PostController.save);
/**
 * Route Listing of all posts  {GET}
 * @name /api/v1/posts
 * @param {string} path - Express path
 */
router.get("/", isLoggedIn, PostController.getAllPosts);
router.get("/:id", isLoggedIn, PostController.getOnePost);
router.delete("/:id", isLoggedIn, PostController.removePost);

export default router;
