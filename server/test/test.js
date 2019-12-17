import app from "../app";
import chai from "chai";
import chaiHttp from "chai-http";

const { expect } = chai;
chai.use(chaiHttp);
chai.should();

describe("Server!", () => {
  it("welcomes user to the api", done => {
    chai
      .request(app)
      .get("/")
      .end((err, res) => {
        expect(res).to.have.status(201);
        expect(res.body.message).to.equals("Welcome To Social Dev");
        done();
      });
  });

  it("adds 2 numbers", done => {
    chai
      .request(app)
      .post("/add")
      .send({ num1: 5, num2: 5 })
      .end((err, res) => {
        expect(res).to.have.status(201);
        expect(res.body.status).to.equals(201);
        expect(res.body.result.sum).to.equals(10);
        done();
      });
  });
});
