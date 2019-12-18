import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

class Auth {
  static generateToken(user) {
    return jwt.sign(user, process.env.SECRET);
  }

  static isValidPassword(password, hashedPassword) {
    return bcrypt.compareSync(password, hashedPassword);
  }

  static hashPassword(password) {
    return bcrypt.hashSync(password, 10);
  }
}

export default Auth;
