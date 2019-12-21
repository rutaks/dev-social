import app from "../app";
import chai from "chai";
import chaiHttp from "chai-http";
import User from "../models/User";
import auth from "../util/auth";

import user1 from "./data/user_data/user_true.json";
import user2 from "./data/user_data/user_true_2.json";
import fakeUser1 from "./data/user_data/user_false.json";
import fakeUser2 from "./data/user_data/user_not_exist.json";
import post1 from "./data/post_data/post_data_true.json";
import fakePost1 from "./data/post_data/post_data_false.json";
import Post from "../models/Post";

chai.use(chaiHttp);
chai.should();

const token = auth.generateToken({ email: user1.email });
const fakeToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJd9";
const fakeToken2 = auth.generateToken({ email: user2.email });

const user3 = {
  firstname: "Sam",
  lastname: "Rutakayile",
  dob: "1996-09-10T00:00:00.000Z",
  gender: "MALE",
  email: "manziguevara@gmail.com",
  password: "$2b$10$QiKd.SzPW57.qjgU7tBjb.B2ZWrJUH0kSm0nc5SrCRDR5JYcqp3CC",
  avatar:
    "//www.gravatar.com/avatar/e5fe7950b7e099e127d622e05a7da6f3?s=200&r=pg&d=mm",
  date: "2019-12-18T13:30:44.722Z"
};

/** POSTS TESTS */
describe("Posts", function() {
  /**TDD DB Setup */
  User.collection.drop().catch(err => {});

  beforeEach(function(done) {
    var newUser = new User({
      user1
    });
    newUser.save(function(err) {
      done();
    });
  });

  afterEach(function(done) {
    User.collection.drop().catch(err => {});
    Post.collection.drop().catch(err => {});
    done();
  });

  /** Tests */
  it("should let user create post", function(done) {
    chai
      .request(app)
      .post("/api/v1/posts/")
      .set("authorization", `Bearer ${token}`)
      .send(post1)
      .end(function(err, res) {
        res.should.have.status(201);
        res.body.should.have.property("message", "Post created successfully");
        done();
      });
  });

  it("should not let user create post not existing user", function(done) {
    chai
      .request(app)
      .post("/api/v1/posts/")
      .set("authorization", `Bearer ${fakeToken2}`)
      .send(post1)
      .end(function(err, res) {
        res.should.have.status(404);
        res.body.should.have.property("error", "User not found");
        done();
      });
  });

  it("should not let user create post on invalid token", function(done) {
    chai
      .request(app)
      .post("/api/v1/posts/")
      .set("authorization", `Bearer ${fakeToken}`)
      .send(post1)
      .end(function(err, res) {
        res.should.have.status(401);
        res.body.should.have.property("error", "Invalid Token");
        done();
      });
  });

  it("should not let user create post on invalid token", function(done) {
    chai
      .request(app)
      .post("/api/v1/posts/")
      .set("authorization", `Bearefr ${token}`)
      .send(post1)
      .end(function(err, res) {
        res.should.have.status(401);
        res.body.should.have.property("error", "Malformed Token");
        done();
      });
  });

  it("should not let user create post without token", function(done) {
    chai
      .request(app)
      .post("/api/v1/posts/")
      .send(post1)
      .end(function(err, res) {
        res.should.have.status(401);
        res.body.should.have.property("error", "No Token Found");
        done();
      });
  });

  it("should not let user create malformed post ", function(done) {
    chai
      .request(app)
      .post("/api/v1/posts/")
      .set("authorization", `Bearer ${token}`)
      .send(fakePost1)
      .end(function(err, res) {
        res.should.have.status(400);
        done();
      });
  });

  it("should let user view post by id", function(done) {
    let newPost = new Post(post1);
    newPost.save(function(err, data) {
      chai
        .request(app)
        .get(`/api/v1/posts/${data._id}`)
        .set("authorization", `Bearer ${token}`)
        .end(function(err, res) {
          res.should.have.status(200);
          res.body.should.have.property(
            "message",
            "Post retrieved successfully"
          );
          done();
        });
    });
  });

  it("should remove post if user is owner", function(done) {
    let user = new User(user3);
    const tempToken = auth.generateToken({ email: user.email });
    user.save().then(res => {
      let newPost = new Post(post1);
      newPost.user = user.id;
      newPost.save().then(res => {
        chai
          .request(app)
          .delete(`/api/v1/posts/${res._id}`)
          .set("authorization", `Bearer ${tempToken}`)
          .end(function(err, res) {
            res.should.have.status(200);
            res.body.should.have.property(
              "message",
              "Post removed successfully"
            );
            done();
          });
      });
    });
  });

  it("should not remove post if post not found", function(done) {
    let user = new User(user3);
    const tempToken = auth.generateToken({ email: user.email });
    const fakePostId = "5dfc93be2fdffe12049f6ffe";
    user.save().then(res => {
      chai
        .request(app)
        .delete(`/api/v1/posts/${fakePostId}`)
        .set("authorization", `Bearer ${tempToken}`)
        .end(function(err, res) {
          res.should.have.status(404);
          res.body.should.have.property("error", "Post not found");
          done();
        });
    });
  });

  it("should not remove post if user is not owner", function(done) {
    let tempUser1 = new User(user3);
    let tempUser2 = new User(user1);
    const tempToken = auth.generateToken({ email: tempUser2.email });
    tempUser2.save().then(res1 => {
      tempUser1.save().then(res2 => {
        let newPost = new Post(post1);
        newPost.user = tempUser1.id;
        newPost.save().then(res => {
          chai
            .request(app)
            .delete(`/api/v1/posts/${res._id}`)
            .set("authorization", `Bearer ${token}`)
            .end(function(err, res) {
              res.should.have.status(401);
              res.body.should.have.property("error", "User not authorized");
              done();
            });
        });
      });
    });
  });

  it("should modify post if user is owner", function(done) {
    let user = new User(user3);
    const tempToken = auth.generateToken({ email: user.email });
    user.save().then(res => {
      let newPost = new Post(post1);
      newPost.user = user.id;
      newPost.save().then(res => {
        newPost.title = "test 2";
        newPost.body = "body test 2";
        newPost.category = "Cat Test";
        chai
          .request(app)
          .put(`/api/v1/posts/${res._id}`)
          .set("authorization", `Bearer ${tempToken}`)
          .send(newPost)
          .end(function(err, res) {
            res.should.have.status(200);
            res.body.should.have.property(
              "message",
              "Post modified successfully"
            );
            done();
          });
      });
    });
  });

  it("should not modify post if user is not owner", function(done) {
    let tempUser1 = new User(user3);
    let tempUser2 = new User(user1);
    const tempToken = auth.generateToken({ email: tempUser2.email });
    tempUser2.save().then(res1 => {
      tempUser1.save().then(res2 => {
        let newPost = new Post(post1);
        newPost.user = tempUser1.id;
        newPost.save().then(res => {
          newPost.title = "test 2";
          newPost.body = "body test 2";
          newPost.category = "Cat Test";
          chai
            .request(app)
            .put(`/api/v1/posts/${res._id}`)
            .set("authorization", `Bearer ${token}`)
            .send(newPost)
            .end(function(err, res) {
              res.should.have.status(401);
              res.body.should.have.property("error", "User not authorized");
              done();
            });
        });
      });
    });
  });
});
