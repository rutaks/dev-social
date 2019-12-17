class Response {
  static send201(res, msg, data) {
    res.status(201).json({
      status: 201,
      message: msg,
      result: data
    });
  }
}

export default Response;
