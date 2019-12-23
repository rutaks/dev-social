import Profile from "../models/Profile";
import User from "../models/User";
import response from "../util/response";
import validator from "../util/validators/validator";
import Post from "../models/Post";

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
    const { error } = validator.validateProfile(req.body);
    if (error) {
      return response.send400(res, error.details[0].message);
    }
    const user = await User.findOne({ email: userEmail });
    const {
      company,
      website,
      location,
      bio,
      status,
      githubusername,
      skills,
      youtube,
      facebook,
      twitter,
      instagram,
      linkedin
    } = req.body;

    const profileFields = {};
    profileFields.user = user.id;
    if (company) profileFields.company = company;
    if (website) profileFields.website = website;
    if (location) profileFields.location = location;
    if (bio) profileFields.bio = bio;
    if (githubusername) profileFields.githubusername = githubusername;
    profileFields.status = status;
    profileFields.skills = skills;

    profileFields.social = {};
    if (youtube) profileFields.social.youtube = youtube;
    if (twitter) profileFields.social.twitter = twitter;
    if (facebook) profileFields.social.facebook = facebook;
    if (linkedin) profileFields.social.linkedin = linkedin;
    if (instagram) profileFields.social.instagram = instagram;

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
