import mongoose, { Schema } from "mongoose";

const stringRequired = {
  type: String,
  required: true
};

const userField = {
  type: Schema.Types.ObjectId,
  ref: "users"
};

const PostSchema = new mongoose.Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: "users"
  },
  title: stringRequired,
  body: stringRequired,
  category: {
    type: String
  },
  firstname: {
    type: String
  },
  lastname: {
    type: String
  },

  avatar: {
    type: String
  },
  likes: [
    {
      user: userField
    }
  ],
  comments: [
    {
      user: userField,
      text: {
        type: String,
        required: true
      },
      firstname: {
        type: String
      },
      lastname: {
        type: String
      },
      avatar: {
        type: String
      },
      date: {
        type: Date,
        default: Date.now
      }
    }
  ],
  date: {
    type: Date,
    default: Date.now
  }
});

const Post = mongoose.model("post", PostSchema);

export default Post;
