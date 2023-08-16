class ApiError extends Error {
    constructor(message, statusCode,about='') {
      super(message);
      this.mess = message;
      this.statusCode = statusCode;
      this.about=about;
      this.status = `${statusCode}`.startsWith(4) ? "fail" : "error";
      this.isOperitional = true;
    }
  }
  
  module.exports = ApiError;
  