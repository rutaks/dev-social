import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import response from "../util/response";
import User from "../models/User";
import Post from "../models/Post";

class Auth {
  static generateToken(user) {
    return jwt.sign(user, process.env.SECRET);
  }

  static isValidPassword(password, hashedPassword) {
    return bcrypt.compareSync(password, hashedPassword);
  }

  static hashPassword(password) {
    return bcrypt.hashSync(password, 10);
  }

  static async getAuthPost(req, res, postId) {
    const userEmail = req.decoded.email;
    const post = await Post.findById(postId);
    const user = await User.findOne({ email: userEmail }).select("-password");

    if (!post) {
      response.send404(res, "Post not found");
      return false;
    }

    if (post.user.toString() !== user.id) {
      response.send401(res, "User not authorized");
      return false;
    }

    return post;
  }
}

export default Auth;
