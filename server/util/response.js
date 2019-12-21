class Response {
  static send200(res, msg, val) {
    /* istanbul ignore next */
    const value = typeof val === "undefined" ? "" : val;
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

  static send400(res, error) {
    return res.status(400).json({
      status: 400,
      error: error
    });
  }

  static send401(res, error) {
    return res.status(401).json({
      status: 401,
      error: error
    });
  }

  static send404(res, error) {
    /* istanbul ignore next */
    return res.status(404).json({
      status: 404,
      error: error
    });
  }

  static send409(res, error) {
    return res.status(409).json({
      status: 409,
      error: error
    });
  }

  static send500(res, error) {
    return res.status(500).json({
      status: 500,
      error: error
    });
  }
}

export default Response;
