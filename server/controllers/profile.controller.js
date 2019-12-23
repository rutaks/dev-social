import Profile from "../models/Profile";
import User from "../models/User";
import response from "../util/response";
import validator from "../util/validators/validator";
import Post from "../models/Post";

const assignProfileFields = (req, user) => {
  const profileFields = {};
  profileFields.user = user.id;
  if (req.body.company) profileFields.company = req.body.company;
  if (req.body.website) profileFields.website = req.body.website;
  if (req.body.location) profileFields.location = req.body.location;
  if (req.body.bio) profileFields.bio = req.body.bio;
  if (req.body.githubusername)
    profileFields.githubusername = req.body.githubusername;
  profileFields.social = {};
  if (req.body.youtube) profileFields.social.youtube = req.body.youtube;
  if (req.body.twitter) profileFields.social.twitter = req.body.twitter;
  if (req.body.facebook) profileFields.social.facebook = req.body.facebook;
  if (req.body.linkedin) profileFields.social.linkedin = req.body.linkedin;
  if (req.body.instagram) profileFields.social.instagram = req.body.instagram;
  return profileFields;
};
class ProfileController {
  static async getProfiles(req, res) {
    try {
      const profiles = await Profile.find().populate("user", [
        "name",
        "avatar"
      ]);

      if (!profiles) {
        return response.send400(res, "No profile found");
      }

      return response.send200(res, "Profiles found", profiles);
    } catch (err) {
      /* istanbul ignore next */
      response.send500(res, "Internal Server Error, Try Again Later");
      throw err;
    }
  }

  static async getSpecificProfile(req, res) {
    const userId = req.params.user_id;
    try {
      const profile = await Profile.findOne({
        user: userId
      }).populate("user", ["name", "avatar"]);

      if (!profile) {
        return response.send400(res, "No profile found");
      }

      return response.send200(res, "Profile found", profile);
    } catch (err) {
      /* istanbul ignore next */
      response.send500(res, "Internal Server Error, Try Again Later");
      throw err;
    }
  }

  static async getCurrentProfile(req, res) {
    const userEmail = req.decoded.email;

    try {
      const user = await User.findOne({ email: userEmail });
      const profile = await Profile.findOne({ user: user.id });

      if (!profile) {
        return response.send400(res, "No profile found for this user");
      }

      return response.send200(res, "Profile found", profile);
    } catch (error) {
      /* istanbul ignore next */
      response.send500(res, "Internal Server Error, Try Again Later");
      throw err;
    }
  }

  static async updateProfile(req, res) {
    const userEmail = req.decoded.email;
    const { error, value } = validator.validateProfile(req.body);
    if (error) {
      return response.send400(res, error.details[0].message);
    }
    const user = await User.findOne({ email: userEmail });
    const profileFields = assignProfileFields(req, user);

    profileFields.status = value.status;
    profileFields.skills = value.skills;

    try {
      let profile = await Profile.findOneAndUpdate(
        { user: user.id },
        { $set: profileFields },
        { new: true, upsert: true }
      );
      return response.send200(res, "Profile updated", profile);
    } catch (err) {
      /* istanbul ignore next */
      response.send500(res, "Internal Server Error, Try Again Later");
      throw err;
    }
  }

  static async removeProfile(req, res) {
    const userEmail = req.decoded.email;
    try {
      const user = await User.findOne({ email: userEmail });

      if (!user) {
        return response.send400(res, "No profile found");
      }

      await Post.deleteMany({ user: user.id });
      await Profile.findOneAndRemove({ user: user.id });
      await User.findOneAndRemove({ _id: user.id });
      return response.send200(res, "Profile removed");
    } catch (err) {
      /* istanbul ignore next */
      response.send500(res, "Internal Server Error, Try Again Later");
      throw err;
    }
  }
}

export default ProfileController;
