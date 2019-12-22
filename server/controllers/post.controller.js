import response from "../util/response";
import validator from "../util/validators/validator";
import User from "../models/User";
import Post from "../models/Post";
import Auth from "../util/auth";

const foundLike = (post, user) =>
  post.likes.filter(like => like.user.toString() === user.id).length;

class PostController {
  static async getAllPosts(req, res) {
    try {
      const posts = await Post.find().sort({ date: -1 });
      return response.send200(res, "Posts retrieved successfully", { posts });
    } catch (err) {
      /* istanbul ignore next */
      response.send500(res, "Internal Server Error, Try Again Later");
      throw err;
    }
  }

  static async getOnePost(req, res) {
    const id = req.params.id;
    try {
      if (!id.match(/^[0-9a-fA-F]{24}$/)) {
        return response.send404(res, "Invalid ID");
      }

      const post = await Post.findById(id);

      if (!post) {
        return response.send404(res, "Post not found");
      }

      return response.send200(res, "Post retrieved successfully", { post });
    } catch (err) {
      /* istanbul ignore next */
      response.send500(res, "Internal Server Error, Try Again Later");
      throw err;
    }
  }

  static async save(req, res) {
    const { title, body, category } = req.body;
    const { value, error } = validator.validatePost({ title, body, category });

    if (error) {
      return response.send400(res, error.details[0].message);
    }

    try {
      const email = req.decoded.email;
      const user = await User.findOne({ email: email }).select("-password");

      if (!user) {
        return response.send404(res, "User not found");
      }

      value.firstname = user.firstname;
      value.lastname = user.lastname;
      value.avatar = user.avatar;
      value.user = user.id;

      const newPost = new Post(value);
      newPost.save();

      return response.send201(res, "Post created successfully", newPost);
    } catch (err) {
      /* istanbul ignore next */
      response.send500(res, "Internal Server Error, Try Again Later");
      throw err;
    }
  }

  static async modifyPost(req, res) {
    const id = req.params.id;
    const { title, body, category } = req.body;
    const { error } = validator.validatePost({ title, body, category });

    if (error) {
      return response.send400(res, error.details[0].message);
    }

    try {
      if (!id.match(/^[0-9a-fA-F]{24}$/)) {
        return response.send404(res, "Invalid ID");
      }

      const post = await Auth.getAuthPost(req, res, id);

      if (post) {
        post.title = title;
        post.body = body;
        post.category = category;

        await post.save();
        return response.send200(res, "Post modified successfully");
      }
    } catch (err) {
      /* istanbul ignore next */
      response.send500(res, "Internal Server Error, Try Again Later");
      throw err;
    }
  }

  static async removePost(req, res) {
    const id = req.params.id;
    try {
      if (!id.match(/^[0-9a-fA-F]{24}$/)) {
        return response.send404(res, "Invalid ID");
      }
      const post = await Auth.getAuthPost(req, res, id);

      if (post) {
        await post.remove();
        return response.send200(res, "Post removed successfully");
      }
    } catch (err) {
      /* istanbul ignore next */
      response.send500(res, "Internal Server Error, Try Again Later");
      throw err;
    }
  }

  static async likePost(req, res) {
    const id = req.params.id;
    const userEmail = req.decoded.email;
    try {
      const post = await Post.findById(id);
      const user = await User.findOne({ email: userEmail }).select("-password");
      if (foundLike(post, user) > 0) {
        return response.send400(res, "Post already liked");
      }
      post.likes.unshift({ user: user.id });

      await post.save();
      response.send200(res, "Liked post successfully", post.likes);
    } catch (err) {
      /* istanbul ignore next */
      response.send500(res, "Internal Server Error, Try Again Later");
      throw err;
    }
  }

  static async unlikePost(req, res) {
    const id = req.params.id;
    const userEmail = req.decoded.email;

    try {
      const post = await Post.findById(id);
      const user = await User.findOne({ email: userEmail }).select("-password");
      if (foundLike(post, user) === 0) {
        return response.send400(res, "Post hasn't been liked yet");
      }
      const removeIndex = post.likes
        .map(like => like.user.toString())
        .indexOf(user.id);

      post.likes.splice(removeIndex, 1);

      await post.save();
      response.send200(res, "Unliked post successfully", post.likes);
    } catch (err) {
      /* istanbul ignore next */
      response.send500(res, "Internal Server Error, Try Again Later");
      throw err;
    }
  }
}

export default PostController;
