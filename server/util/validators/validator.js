import Joi from "@hapi/joi";

class Validator {
  static validateAccount(email, password) {
    let accountSchema = Joi.object({
      email: Joi.string()
        .email()
        .required(),
      password: Joi.string()
        .regex(/^[a-zA-Z0-9]{3,30}$/)
        .required()
        .messages({
          string: `Invalid Password Format`
        })
    });

    return accountSchema.validate({ email, password });
  }

  static validateUser(user) {
    let userSchema = Joi.object({
      firstname: Joi.string().required(),
      lastname: Joi.string().required(),
      email: Joi.string().email({
        minDomainSegments: 2,
        tlds: { allow: ["com", "rw", "fr"] }
      }),
      dob: Joi.date()
        .greater("1-1-1974")
        .allow(""),
      gender: Joi.string()
        .valid("MALE", "FEMALE")
        .uppercase()
        .required(),
      password: Joi.string()
        .regex(/^[a-zA-Z0-9]{3,30}$/)
        .required()
    });
    return userSchema.validate(user);
  }

  static validatePost(post) {
    let postSchema = Joi.object({
      title: Joi.string().required(),
      body: Joi.string().required(),
      category: Joi.string().required()
    }).unknown(true);
    return postSchema.validate(post);
  }

  static validateProfile(profile) {
    let profileSchema = Joi.object({
      skills: Joi.array().required(),
      status: Joi.string().required()
    }).unknown(true);
    return profileSchema.validate(profile);
  }
}

export default Validator;
