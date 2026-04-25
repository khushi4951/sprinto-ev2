function validateBody(requiredFields) {
  return function bodyValidator(req, res, next) {
    const body = req.body || {};
    const missing = requiredFields.filter((field) => {
      const value = body[field];
      return value === undefined || value === null || String(value).trim() === "";
    });

    if (missing.length > 0) {
      return res.status(400).json({
        error: "BadRequest",
        message: `Missing required fields: ${missing.join(", ")}`,
      });
    }

    return next();
  };
}

function validate(schema) {
  return function validateInput(req, res, next) {
    const errors = [];
    const body = req.body || {};

    for (const [field, rules] of Object.entries(schema || {})) {
      const value = body[field];
      const exists = value !== undefined && value !== null && String(value).trim() !== "";

      if (rules.required && !exists) {
        errors.push(`${field} is required`);
        continue;
      }

      if (!exists) continue;

      if (rules.type === "email") {
        const ok = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(value));
        if (!ok) errors.push(`${field} must be a valid email`);
      }

      if (rules.type === "enum" && Array.isArray(rules.values) && !rules.values.includes(value)) {
        errors.push(`${field} must be one of: ${rules.values.join(", ")}`);
      }

      if (rules.minLength && String(value).length < rules.minLength) {
        errors.push(`${field} must be at least ${rules.minLength} characters`);
      }
    }

    if (errors.length) {
      return res.status(400).json({
        error: "BadRequest",
        message: "Validation failed",
        details: errors,
      });
    }

    return next();
  };
}

module.exports = { validateBody, validate };
