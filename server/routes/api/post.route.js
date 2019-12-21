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
/**
 * Route Listing of specific post By ID  {GET}
 * @name /api/v1/posts/:id
 * @param {string} path - Express path
 */
router.get("/:id", isLoggedIn, PostController.getOnePost);
/**
 * Route Deleting of specific post by ID  {DELETE}
 * @name /api/v1/posts/:id
 * @param {string} path - Express path
 */
router.delete("/:id", isLoggedIn, PostController.removePost);
/**
 * Route Modifying of specific post by id  {PUT}
 * @name /api/v1/posts/:id
 * @param {string} path - Express path
 */
router.put("/:id", isLoggedIn, PostController.modifyPost);

export default router;
