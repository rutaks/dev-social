import app from "../app";
import chai from "chai";
import chaiHttp from "chai-http";
import User from "../models/User";
import auth from "../util/auth";

import user1 from "./data/user_data/user_true.json";
import fakeUser1 from "./data/user_data/user_false.json";
import post1 from "./data/post_data/post_data_true.json";
import fakePost1 from "./data/post_data/post_data_false.json";

chai.use(chaiHttp);
chai.should();

const token =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6InJ1dGFrc2FtQGdtYWlsLmNvbSIsImlhdCI6MTU3Njc1NzY3Nn0._7R1ymFxrjZnv3OLmaYpA3KWOURl1pHqEnPTrUZuZqY";
const fakeToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJd9";
const fakeToken2 = auth.generateToken({ email: fakeUser1.email });

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

  // it("should not allow user to create account on account is already existing", function(done) {
  //   chai
  //     .request(app)
  //     .post("/api/v1/auth/signup")
  //     .send(user)
  //     .end(function(err, res) {
  //       res.should.have.status(409);
  //       res.body.should.have.property("message", "User Successfully Created");
  //       done();
  //     });
  // });

  //   it("should login user", function(done) {
  //     chai
  //       .request(app)
  //       .post("/api/v1/auth/signin")
  //       .send(account1)
  //       .end(function(err, res) {
  //         res.should.have.status(200);
  //         res.body.should.have.property("message", "Login Successful");
  //         done();
  //       });
  //   });

  //   it("should not login user on account not found", function(done) {
  //     chai
  //       .request(app)
  //       .post("/api/v1/auth/signin")
  //       .send(account5)
  //       .end(function(err, res) {
  //         res.should.have.status(409);
  //         res.body.should.have.property("error", "Invalid Credentials");
  //         done();
  //       });
  //   });

  //   it("should not login user on invalid email", function(done) {
  //     chai
  //       .request(app)
  //       .post("/api/v1/auth/signin")
  //       .send(account2)
  //       .end(function(err, res) {
  //         res.should.have.status(400);
  //         res.body.should.have.property("error", '"email" must be a valid email');
  //         done();
  //       });
  //   });

  //   it("should not login user on invalid password", function(done) {
  //     chai
  //       .request(app)
  //       .post("/api/v1/auth/signin")
  //       .send(account3)
  //       .end(function(err, res) {
  //         res.should.have.status(400);
  //         done();
  //       });
  //   });

  //   it("should not login user on incorrect password", function(done) {
  //     chai
  //       .request(app)
  //       .post("/api/v1/auth/signin")
  //       .send(account4)
  //       .end(function(err, res) {
  //         res.should.have.status(409);
  //         res.body.should.have.property("error", "Invalid Credentials");
  //         done();
  //       });
  //   });
});
