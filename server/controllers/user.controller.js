import validate from "../util/validators/validator";
import gravatar from "../util/gravatar";
import response from "../util/response";
import User from "../models/User";
import auth from "../util/auth";

/** Class Holding All User Authentication methods */
class AuthController {
  /**
   * Receives values from request & validates if
   * user can create account, if user data is inconsistent
   * user will receive a response specifying account creation error
   * @param {Object[]} req - Request
   * @param {Object[]} res - Response
   * @returns {Object[]} Response Object with its status
   */
  static async signup(req, res) {
    const { error, value } = validate.validateUser(req.body);

    if (error) {
      return response.send409(res, error.details[0].message);
    }
    try {
      value.avatar = gravatar.generateAvatar(value.email);
      value.password = auth.hashPassword(value.password);
      const user = new User(value);

      await user.save();
      response.send201(res, "User Successfully Created", {
        user,
        token: auth.generateToken({ email: user.email })
      });
    } catch (err) {
      throw err;
    }
  }

  /**
   * Receives values from request & validates if
   * user exists & can login, on failure will receive
   * a response message specifying the error, on success
   * will receive a success message & JWT as reponse
   * @param {Object[]} req - Request
   * @param {Object[]} res - Response
   * @returns {Object[]} Response Object with its status
   */
  static async login(req, res) {
    const { email, password } = req.body;
    const { error } = validate.validateAccount(email, password);
    try {
      if (error) {
        response.send404(res, error.details[0].message);
      } else {
        let user = await User.findOne({ email }).exec();
        if (user) {
          /* istanbul ignore next */
          let check = auth.isValidPassword(password, user.password);
          /* istanbul ignore next */
          check
            ? response.send200(res, "Login Successful", {
                token: auth.generateToken({
                  email: user.email
                })
              })
            : response.send409(res, "Invalid Credentials");
        } else {
          response.send409(res, "Invalid Credentials");
        }
      }
    } catch (err) {
      throw err;
    }
  }
}

export default AuthController;
