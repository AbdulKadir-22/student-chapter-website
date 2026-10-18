const { z } = require('zod');

const validate = (schema) => (req, res, next) => {
  try {
    const parsed = schema.parse({
      body: req.body,
      query: req.query,
      params: req.params,
    });
    // Replace with parsed values if needed
    if (parsed.body) req.body = parsed.body;
    if (parsed.query) req.query = parsed.query;
    if (parsed.params) req.params = parsed.params;
    next();
  } catch (error) {
    if (error instanceof z.ZodError) {
      const issues = error.issues || error.errors || [];
      return res.status(400).json({
        message: issues[0]?.message || 'Validation error',
        errors: issues.map((e) => ({
          field: (e.path || []).join('.').replace(/^(body|query|params)\./, ''),
          message: e.message,
        })),
      });
    }
    next(error);
  }
};

module.exports = validate;
