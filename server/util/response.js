class Response {
  /* istanbul ignore next */
  static send200(res, msg, val) {
    /* istanbul ignore next */
    const value = typeof val === "undefined" ? "" : val;
    /* istanbul ignore next */
    return res.status(200).json({
      status: 200,
      message: msg,
      value: value
    });
  }
  static send201(res, msg, data) {
    return res.status(201).json({
      status: 201,
      message: msg,
      result: data
    });
  }

  static send404(res, error) {
    return res.status(409).json({
      status: 409,
      error: error
    });
  }
  /* istanbul ignore next */
  static send409(res, error) {
    /* istanbul ignore next */
    return res.status(409).json({
      status: 409,
      error: error
    });
  }
}

export default Response;
