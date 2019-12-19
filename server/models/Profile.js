import mongoose from "mongoose";

const stringRequired = {
  type: String,
  required: true
};

const details = {
  from: {
    type: Date,
    required: true
  },
  to: {
    type: Date
  },
  current: {
    type: Boolean,
    default: false
  },
  description: {
    type: String
  }
};

const ProfileSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user"
  },
  company: {
    type: String
  },
  website: {
    type: String
  },
  location: {
    type: String
  },
  status: {
    type: String
  },
  skills: {
    type: [String],
    required: true
  },
  bio: {
    type: String
  },
  github: {
    type: String
  },
  experience: [
    {
      title: stringRequired,
      company: stringRequired,
      location: stringRequired,
      details: details
    }
  ],
  education: [
    {
      school: stringRequired,
      degree: stringRequired,
      studyfield: stringRequired,
      details: details
    }
  ],
  social: {
    youtube: {
      type: String
    },
    twitter: {
      type: String
    },
    facebook: {
      type: String
    },
    linkedin: {
      type: String
    },
    instagram: {
      type: String
    }
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const Profile = mongoose.model("profile", ProfileSchema);

export default Profile;
