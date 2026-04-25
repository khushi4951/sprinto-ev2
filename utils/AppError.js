class AppError extends Error {
  constructor(message, statusCode = 500, name = "Error") {
    super(message);
    this.statusCode = statusCode;
    this.name = name;
  }
}

module.exports = { AppError };
