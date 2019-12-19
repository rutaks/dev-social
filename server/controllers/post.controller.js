import response from "../util/response";
import validator from "../util/validators/validator";
import User from "../models/User";
import Post from "../models/Post";

class PostController {
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
      console.error("ERR: ", err.message);
      return response.send500(res, "Internal Server Error, Try Again Later");
    }
  }
}

export default PostController;
