import app from "../app";
import chai from "chai";
import chaiHttp from "chai-http";
import User from "../models/User";
import auth from "../util/auth";

import user1 from "./data/user_data/user_true.json";
import Post from "../models/Post";
import Profile from "../models/Profile";

chai.use(chaiHttp);
chai.should();

const token = auth.generateToken({ email: user1.email });

/** POSTS TESTS */
describe("Profile", function() {
  /**TDD DB Setup */
  User.collection.drop().catch(err => {});

  afterEach(function(done) {
    User.collection.drop().catch(err => {});
    Profile.collection.drop().catch(err => {});
    done();
  });
  /** Tests */
  it("should get all profiles", function(done) {
    var newUser = new User(user1);
    newUser.save().then(user => {
      var skills = ["java"];
      var status = "employed";
      var profile = new Profile({
        status,
        skills,
        user: user.id
      });
      profile.save().then(prof => {
        chai
          .request(app)
          .get("/api/v1/profile/")
          .end(function(err, res) {
            res.should.have.status(200);
            res.body.should.have.property("message", "Profiles found");
            done();
          });
      });
    });
  });

  it("should update profile", function(done) {
    var newUser = new User(user1);
    newUser.save().then(user => {
      var skills = ["java"];
      var status = "employed";
      var updatedSkills = ["java", "c++"];
      var updatedStatus = "student";
      var profile = new Profile({
        status,
        skills,
        user: user.id
      });
      profile.save().then(prof => {
        chai
          .request(app)
          .post("/api/v1/profile/")
          .set("authorization", `Bearer ${token}`)
          .send({ skills: updatedSkills, status: updatedStatus })
          .end(function(err, res) {
            res.should.have.status(200);
            res.body.should.have.property("message", "Profile updated");
            done();
          });
      });
    });
  });

  it("should update profile with optional profiles", function(done) {
    var newUser = new User(user1);
    newUser.save().then(user => {
      var skills = ["java"];
      var status = "employed";
      var updatedSkills = ["java", "c++"];
      var company = "Company test";
      var updatedStatus = "student";
      var bio = "Involved Developer";
      var location = "Test Location";
      var githubusername = "github.com";
      var website = "https://www.youtube.com/channel/UCtxCXg-UvSnTKPOzLH4wJaQ";
      var twitter = "https://www.youtube.com/channel/UCtxCXg-UvSnTKPOzLH4wJaQ";
      var youtube = "https://www.youtube.com/channel/UCtxCXg-UvSnTKPOzLH4wJaQ";
      var facebook = "https://www.youtube.com/channel/UCtxCXg-UvSnTKPOzLH4wJaQ";
      var linkedin = "https://www.youtube.com/channel/UCtxCXg-UvSnTKPOzLH4wJaQ";
      var instagram =
        "https://www.youtube.com/channel/UCtxCXg-UvSnTKPOzLH4wJaQ";
      var profile = new Profile({
        status,
        skills,
        user: user.id
      });
      profile.save().then(prof => {
        chai
          .request(app)
          .post("/api/v1/profile/")
          .set("authorization", `Bearer ${token}`)
          .send({
            twitter: twitter,
            location: location,
            website: website,
            company: company,
            bio: bio,
            githubusername: githubusername,
            skills: updatedSkills,
            status: updatedStatus,
            youtube: youtube,
            facebook: facebook,
            linkedin: linkedin,
            instagram: instagram
          })
          .end(function(err, res) {
            res.should.have.status(200);
            res.body.should.have.property("message", "Profile updated");
            done();
          });
      });
    });
  });

  it("should not update profile with optional profiles", function(done) {
    var newUser = new User(user1);
    newUser.save().then(user => {
      var skills = ["java"];
      var status = "employed";
      var updatedSkills = ["java", "c++"];
      var company = "Company test";
      var updatedStatus = "student";
      var bio = "Involved Developer";
      var location = "Test Location";
      var githubusername = "github.com";
      var website = "https://www.youtube.com/channel/UCtxCXg-UvSnTKPOzLH4wJaQ";
      var twitter = "https://www.youtube.com/channel/UCtxCXg-UvSnTKPOzLH4wJaQ";
      var youtube = "https://www.youtube.com/channel/UCtxCXg-UvSnTKPOzLH4wJaQ";
      var facebook = "https://www.youtube.com/channel/UCtxCXg-UvSnTKPOzLH4wJaQ";
      var linkedin = "https://www.youtube.com/channel/UCtxCXg-UvSnTKPOzLH4wJaQ";
      var instagram =
        "https://www.youtube.com/channel/UCtxCXg-UvSnTKPOzLH4wJaQ";
      var profile = new Profile({
        status,
        skills,
        user: user.id
      });
      profile.save().then(prof => {
        chai
          .request(app)
          .post("/api/v1/profile/")
          .set("authorization", `Bearer ${token}`)
          .send({
            twitter: twitter,
            location: location,
            website: website,
            company: company,
            bio: bio,
            githubusername: githubusername,
            youtube: youtube,
            facebook: facebook,
            linkedin: linkedin,
            instagram: instagram
          })
          .end(function(err, res) {
            res.should.have.status(400);
            done();
          });
      });
    });
  });
});
