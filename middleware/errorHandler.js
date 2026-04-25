/**
 * Error handling middleware
 *
 * Express routing concept:
 * - Routes map HTTP methods + paths to handlers.
 * - If a handler throws/rejects, we centralize error responses here.
 */

function notFound(req, res, next) {
  const wantsHtml = req.accepts("html") && !req.path.startsWith("/api/");
  if (wantsHtml) {
    return res.status(404).render("login", { pageTitle: "Not Found", error: "Page not found" });
  }
  return res.status(404).json({ error: "NotFound", message: "Route not found" });
}

// eslint-disable-next-line no-unused-vars
function errorHandler(err, req, res, next) {
  const status = err.statusCode || err.status || 500;
  const message = err.message || "Internal Server Error";

  if (status >= 500) {
    // eslint-disable-next-line no-console
    console.error("Unhandled error:", err);
  }

  const wantsHtml = req.accepts("html") && !req.path.startsWith("/api/");
  if (wantsHtml) {
    return res.status(status).render("login", {
      pageTitle: status >= 500 ? "Server Error" : "Request Error",
      error: message,
    });
  }

  return res.status(status).json({
    error: err.name || "Error",
    message,
  });
}

module.exports = { notFound, errorHandler };

