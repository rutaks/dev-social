import jwt from "jsonwebtoken";
import response from "../util/response";

const isLoggedIn = async (req, res, next) => {
  try {
    let token = req.headers["x-access-token"] || req.headers["authorization"];

    if (!token) {
      response.send401(res, "No Token Found");
    }

    if (token.startsWith("Bearer ")) {
      token = token.slice(7, token.length);
    } else {
      response.send401(res, "Malformed Token");
    }

    jwt.verify(token, process.env.SECRET, (error, decoded) => {
      if (error) {
        response.send401(res, "Invalid Token");
      } else {
        req.decoded = decoded;
        next();
      }
    });
  } catch (error) {
    response.send500(res, "Something Happened, Please Try Again Later ");
    throw error;
  }
};

export default isLoggedIn;
