import app from "../app";
import chai from "chai";
import chaiHttp from "chai-http";
import { mongoose } from "mongoose";
import User from "../models/User";

import account1 from "./data/auth_data/login_true.json";
import account2 from "./data/auth_data/login_false_email.json";
import account3 from "./data/auth_data/login_false_password.json";
import account4 from "./data/auth_data/login_false_password_2.json";
import account5 from "./data/auth_data/login_false_no_account.json";
import user from "./data/user_data/user_true.json";
import user2 from "./data/user_data/user_true_2.json";

chai.use(chaiHttp);
chai.should();

/** AUTHENTICATION TESTS */
describe("Auth", function() {
  /**TDD DB Setup */
  User.collection.drop().catch(err => {});

  beforeEach(function(done) {
    var newUser = new User({
      user
    });
    newUser.save(function(err) {
      done();
    });
  });

  /** Tests */
  it("should allow user to create account", function(done) {
    chai
      .request(app)
      .post("/api/v1/auth/signup")
      .send(user2)
      .end(function(err, res) {
        res.should.have.status(201);
        res.body.should.have.property("message", "User Successfully Created");
        done();
      });
  });

  it("should login user", function(done) {
    chai
      .request(app)
      .post("/api/v1/auth/signin")
      .send(account1)
      .end(function(err, res) {
        res.should.have.status(200);
        res.body.should.have.property("message", "Login Successful");
        done();
      });
  });

  it("should not login user on account not found", function(done) {
    chai
      .request(app)
      .post("/api/v1/auth/signin")
      .send(account5)
      .end(function(err, res) {
        res.should.have.status(409);
        res.body.should.have.property("error", "Invalid Credentials");
        done();
      });
  });

  it("should not login user on invalid email", function(done) {
    chai
      .request(app)
      .post("/api/v1/auth/signin")
      .send(account2)
      .end(function(err, res) {
        res.should.have.status(409);
        res.body.should.have.property("error", '"email" must be a valid email');
        done();
      });
  });

  it("should not login user on invalid password", function(done) {
    chai
      .request(app)
      .post("/api/v1/auth/signin")
      .send(account3)
      .end(function(err, res) {
        res.should.have.status(409);
        done();
      });
  });

  it("should not login user on incorrect password", function(done) {
    chai
      .request(app)
      .post("/api/v1/auth/signin")
      .send(account4)
      .end(function(err, res) {
        res.should.have.status(409);
        res.body.should.have.property("error", "Invalid Credentials");
        done();
      });
  });
});
