import gravatar from "gravatar";

class Gravatar {
  static generateAvatar(email) {
    /* istanbul ignore next */
    if (typeof email === "undefined") {
      throw Error("Could Not Create Avatar");
    }

    const avatar = gravatar.url(email, {
      s: "200",
      r: "pg",
      d: "mm"
    });
    return avatar;
  }
}

export default Gravatar;
